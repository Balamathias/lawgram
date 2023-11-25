import { Models } from "appwrite"
import { useDeleteComment, useLikeComment } from "../react-query/queriesAndMutations"
import React, { useState } from "react"
import { checkIsLiked } from "../utils"
import { 
    Popover, 
    PopoverTrigger, 
    PopoverContent, 
    Button as NextUIButton,
    Image,
    useDisclosure, 
} from '@nextui-org/react'

import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../react-query/queryKeys"
import UpdateComment from "@/components/UpdateComment"


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

    const {isOpen, onOpen, onOpenChange} = useDisclosure()
  
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
            <Image
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
        {userId == comment?.user?.$id && <UpdateComment postId={comment?.post?.$id} action="Update" comment={comment} />}
            <Popover placement="bottom" 
                showArrow 
                offset={10} 
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <PopoverTrigger>
                    <NextUIButton
                        onPress={onOpen} 
                        color="default"
                        isIconOnly
                        variant="faded"
                        className="bg-dark-3 border-none rounded-full"
                    >
                        <Image
                            src={`/assets/icons/vert-ellipsis.svg`}
                            width={20}
                            height={20}
                            onClick={()=>{}}
                            alt="save"
                            className="cursor-pointer"
                            />
                    </NextUIButton>
                </PopoverTrigger>
                <PopoverContent className="w-[196px] bg-dark-3">
                    {() => (
                        <div className="py-6 flex flex-col gap-3">
                            <NextUIButton className={`hover:text-lime-50 bg-inherit justify-start`}
                                onClick={copyText}
                                color="primary"
                                startContent={
                                    isCopied ? <Image src="/assets/icons/checkmark.svg" alt="copy" width={24} height={24} /> : <Image src="/assets/icons/copy.svg" alt="copy" width={24} height={24} />
                                }
                            >
                                <span>Cop{isCopied ? 'ied': 'y'}</span>
                            </NextUIButton>
                            {userId == comment?.user?.$id && 
                            <>

                                <NextUIButton isLoading={isDeleting} color="danger" className={`hover:text-lime-50 bg-inherit justify-start`}
                                    onClick={handleDeletePost}
                                    startContent={
                                        <Image src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                                    }
                                >
                                    <span>Delet{isDeleting ? 'ing...': 'e'}</span>
                                </NextUIButton>
                            </>
                            }
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    </div>
  )
}

export default CommentStats