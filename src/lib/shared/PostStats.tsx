import { Models } from "appwrite"
import { useDeleteSavedPost, useGetCurrentUser, useGetPostComments, useLikePost, useSavePost } from "../react-query/queriesAndMutations"
import React, { useEffect, useState } from "react"
import { checkIsLiked } from "../utils"
import { Link, useNavigate } from "react-router-dom"
import { Image } from "@nextui-org/react"


function PostStats({post, userId}: {post?: Models.Document, userId: string, isLiked?: boolean}) {

    const navigate = useNavigate()

    const likeList = post?.likes?.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(likeList)
    const [isSaved, setIsSavedPost] = useState(false)

    const { data: currentUser } = useGetCurrentUser()

    const {mutate: likePost} = useLikePost()
    const {mutate: savePost} = useSavePost()
    const {mutate: deleteSavedPost} = useDeleteSavedPost()

    const {data: comments} = useGetPostComments(post?.$id || '')

    const savedPostRecord = currentUser?.saves.find((record: Models.Document) => record.post.$id === post?.$id)

    useEffect(() => {
        setIsSavedPost(!!savedPostRecord)
    }, [currentUser])

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        let newLikes = [...likes]
        const hasLiked = newLikes?.includes(userId)

        if (hasLiked) {
            newLikes = newLikes?.filter(user => user !== userId)
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

    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation()
        post?.$id ?? navigate(`/posts/${post?.id}`)
    }

  return (
    <div className="flex justify-between gap-3 items-center">
        <div className="flex flex-center gap-1">
            <Image
                src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" :
                    `/assets/icons/like.svg`}
                width={20}
                height={20}
                onClick={handleLikePost}
                alt="like"
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium ml-1 mr-1">{likes?.length}</p>
        </div>
        <Link to={`/posts/${post?.$id}`} className="flex flex-center gap-1">
            <Image
                src={`/assets/icons/comment.svg`}
                width={20}
                height={20}
                onClick={handleComment}
                alt="comment"
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium ml-1 mr-1">{comments?.total ?? comments?.total}</p>
        </Link>
        <div className="flex flex-center gap-1">
            <Image
                src={isSaved ? `/assets/icons/saved.svg` : `/assets/icons/save.svg`}
                width={20}
                height={20}
                onClick={handleSavePost}
                alt="save"
                className="cursor-pointer"
            />
        </div>
    </div>
  )
}

export default PostStats