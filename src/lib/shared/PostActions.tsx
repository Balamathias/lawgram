import { IUser } from "@/types"
import { Models } from "appwrite"
import SharePost from "./SharePost"
import { Link } from "react-router-dom"
import DeletePost from "./DeletePost"
import { Image } from "@nextui-org/image"

function PostActions({post, user}: {post: Models.Document | undefined, user: IUser}) {
  return (
    <div className={`flex-center gap-1 md:gap-4 max-[852px]:flex-col`}>

        <SharePost post={post} />

        <Link to={`/update-post/${post?.$id}`} className={`flex-1 ${user.id !== post?.creator.$id ? "hidden" : ""}`}>
            <Image
                src="/assets/icons/edit.svg"
                alt="edit"
                width={24}
                height={24}
            />
        </Link>
        <div className={`flex-1 ${user.id !== post?.creator.$id ? "hidden" : ""}`}>
        <DeletePost post={post}/>
        </div>
    </div>
  )
}

export default PostActions