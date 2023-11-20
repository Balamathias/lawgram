import { Models } from "appwrite"
import { useDeleteComment, useLikeComment } from "../react-query/queriesAndMutations"
import React, { useState } from "react"
import { checkIsLiked } from "../utils"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import Loader from "./Loader"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../react-query/queryKeys"


type ICommentStats = {
    comment?: Models.Document, 
    userId: string,
    ref?: React.RefObject<HTMLDivElement>,
    isCopied?: boolean,
    copyText?: () => void
}

function CommentStats({comment, userId, isCopied, copyText}: ICommentStats) {

    const likeList = comment?.likes.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(likeList)

    const {mutate: likeComment} = useLikeComment()

    const {mutateAsync: deletePost, isPending: isDeleting} = useDeleteComment()
    
    const queryClient = useQueryClient()
  
  const handleDeletePost = () => {
    deletePost({commentId: comment?.$id || '', imageId: comment?.imageId},{
      onSuccess() {
          queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.GET_POST_BY_ID, comment?.post?.$id]
            })
          return toast.success("Comment deleted successfully.")

      },
    })
  }

    const handleLikeComment = (e: React.MouseEvent) => {
        e.stopPropagation()

        let newLikes = [...likes]
        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter(user => user !== userId)
        } else newLikes.push(userId)
        setLikes(newLikes)

        likeComment({commentId: comment?.$id || '', likesArray: newLikes})
    }

  return (
    <div className="flex justify-between gap-3 items-center relative" style={{zIndex: 290}}>
        <div className="flex flex-center gap-1">
            <img
                src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" :
                    `/assets/icons/like.svg`}
                width={20}
                height={20}
                onClick={handleLikeComment}
                alt="like"
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium ml-1 mr-1">{likes.length}</p>
        </div>
        <div className="flex flex-center gap-1">
            
            <Popover modal={true}>
                <PopoverTrigger className="ghost_details-delete_btn" asChild>
                <img
                    src={`/assets/icons/vert-ellipsis.svg`}
                    width={20}
                    height={20}
                    onClick={()=>{}}
                    alt="save"
                    className="cursor-pointer"
                    />
                </PopoverTrigger>
                <PopoverContent className="absolute -top-40 right-0 px-6 bg-black rounded-lg shadow shadow-lg border-slate-700 border border-green-800">
        
                    <div className="py-6 flex flex-col gap-3">
                        <Button variant={'ghost'} className={`ghost_details-delete_btn justify-end flex items-center gap-3 w-fit hover:text-lime-50`}
                            onClick={copyText}
                        >
                            {isCopied ? <img src="/assets/icons/checkmark.svg" alt="copy" width={16} height={16} /> : <img src="/assets/icons/copy.svg" alt="copy" width={16} height={16} />}
                            <span>Cop{isCopied ? 'ied': 'y'}</span>
                        </Button>
                        {userId == comment?.user?.$id && <Button variant={'ghost'} className={`ghost_details-delete_btn border border-rose-800 justify-end flex items-center gap-3 w-fit hover:bg-rose-800 hover:text-lime-50`}
                            onClick={handleDeletePost}
                        >
                            {isDeleting ? <Loader /> : <img src="/assets/icons/delete.svg" alt="delete" width={16} height={16} />}
                            <span>Delet{isDeleting ? 'ing...': 'e'}</span>
                        </Button>}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    </div>
  )
}

export default CommentStats