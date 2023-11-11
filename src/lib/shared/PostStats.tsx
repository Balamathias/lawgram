import { Models } from "appwrite"
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "../react-query/queriesAndMutations"
import React, { useEffect, useState } from "react"
import { checkIsLiked } from "../utils"
import Loader from "./Loader"


function PostStats({post, userId}: {post?: Models.Document, userId: string}) {

    const likeList = post?.likes.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(likeList)
    const [isSaved, setIsSavedPost] = useState(false)

    const { data: currentUser } = useGetCurrentUser()

    const {mutate: likePost} = useLikePost()
    const {mutate: savePost, isPending: isSaving} = useSavePost()
    const {mutate: deleteSavedPost, isPending: isDeleting} = useDeleteSavedPost()

    const savedPostRecord = currentUser?.saves.find((record: Models.Document) => record.post.$id === post?.$id)

    useEffect(() => {
        setIsSavedPost(!!savedPostRecord)
    }, [currentUser])

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        let newLikes = [...likes]
        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter(user => user !== userId)
        } else newLikes.push(userId)
        setLikes(newLikes)

        likePost({postId: post?.$id || '', likesArray: newLikes})
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (savedPostRecord) {
            setIsSavedPost(false)
            deleteSavedPost(savedPostRecord?.$id)
        } else {
            savePost({postId: post?.$id || '', userId})
            setIsSavedPost(true)
        }
    }

  return (
    <div className="flex justify-between gap-3 items-center">
        <div className="flex flex-center gap-1">
            <img
                src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" :
                    `/assets/icons/like.svg`}
                width={20}
                height={20}
                onClick={handleLikePost}
                alt="like"
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium ml-1 mr-1">{likes.length}</p>
        </div>
        <div className="flex flex-center gap-1">
            {isDeleting || isSaving ? <Loader /> : <img
                src={isSaved ? `/assets/icons/save.svg` : `/assets/icons/saved.svg`}
                width={20}
                height={20}
                onClick={handleSavePost}
                alt="save"
                className="cursor-pointer"
            />}
        </div>
    </div>
  )
}

export default PostStats