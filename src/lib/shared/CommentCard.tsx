import { Models } from "appwrite"
// import PostStats from "./PostStats"
import { shortMultiFormatDateString } from "../utils"
import { Link } from "react-router-dom"
import ProcessedPost from "@/_root/ProcessedPost"
import CommentStats from "./CommentStats"
import { useUserAuth } from "@/context/AuthContext"
import useCopyText from "@/parsers/useCopyText"

function CommentCard({comment}: {comment: Models.Document}) {

    const { user } = useUserAuth()

    const { ref, isCopied, copyText } = useCopyText()
    
    return (
    <div className="post-card shadow-lg backdrop-blur-lg bg-transparent">
        <div className=" flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
                <Link to={`/profile/${comment?.user?.$id}`}>
                    <img 
                    src={comment?.user?.profileImage || '/assets/icons/profile-placeholder.svg'}
                    alt="profile_image"
                    className="w-12 lg:h-12 object-cover rounded-full" 
                    />
                </Link>
                <div className="flex flex-col gap-2">
                    <p className="base-medium flex items-center gap-2 text-light-2 lg:body-bold">
                        <span>@{comment?.user?.username}</span> {comment?.user?.email === 'balamathias40@gmail.com' && 
                        <img
                        src="/assets/icons/twitter-verified-badge.svg"
                        alt="badge"
                        width={20}
                        height={20}
                    />}
                    </p>
                    <div className="flex gap-3">
                        <p className="subtle-semibold lg:small-regular">{shortMultiFormatDateString(comment?.$createdAt)}</p>
                    </div>
                </div>
            </div>
            <div className="small-medium lg:base-medium py-2">
                <div className="subtle-medium tracking-normal text-light-2 leading-9" ref={ref}>
                    <ProcessedPost content={comment?.comment} />
                </div>
            </div>
            {comment?.imageUrl && <img 
                src={comment.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                alt="comment-mage" 
                className="comment-card_img" 
            />}
            <CommentStats comment={comment} userId={user.id} copyText={copyText} isCopied={isCopied} />
        </div>
    </div>
    )
}

export default CommentCard