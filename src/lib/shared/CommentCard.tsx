import { Models } from "appwrite"
// import PostStats from "./PostStats"
import { shortMultiFormatDateString } from "../utils"
import { Link } from "react-router-dom"

function CommentCard({comment}: {comment: Models.Document}) {
    
    return (
    <div className="post-card shadow-lg backdrop-blur-lg bg-transparent">
        <div className=" flex flex-col gap-6 w-full">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${comment?.user?.$id}`}>
                    <img 
                    src={comment?.user?.profileImage || '/assets/icons/profile-placeholder.svg'}
                    alt="profile_image"
                    className="w-12 lg:h-12 object-cover rounded-full" 
                    />
                </Link>
                <div className="flex flex-col gap-3">
                    <p className="base-medium flex items-center gap-2 text-light-2 lg:body-bold">
                        <span>{comment?.user?.name}</span> {comment?.user?.email === 'balamathias40@gmail.com' && 
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
            <div className="small-medium lg:base-medium py-5">
                <p className="base-medium tracking-normal text-light-2 leading-9">{comment.comment}</p>
            </div>
            {comment?.imageUrl && <img 
                src={comment.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                alt="comment-mage" 
                className="comment-card_img" 
            />}
            {/* <PostStats comment={comment} userId={user.id} /> */}
        </div>
    </div>
    )
}

export default CommentCard