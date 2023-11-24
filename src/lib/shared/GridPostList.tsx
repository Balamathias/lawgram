import { useUserAuth } from "@/context/AuthContext"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"
import { Image } from "@nextui-org/react"


interface IGridPostList {
    posts?: Models.Document[], 
    showUser?:boolean, 
    showStats?:boolean, 
    isLiked?:boolean
}

function GridPostList({posts, showUser=true, showStats=true}: IGridPostList) {
    const { user } = useUserAuth()
  return (
    <ul className="grid-container">
        {posts?.map(post => <li key={post?.$id} className="relative w-min-80 h-80">
            <Link to={`/posts/${post.$id}`} className="grid-post_link">
                {post?.imageUrl ? (
                <img
                    src={post?.imageUrl}
                    alt="explore-image"
                    className="w-full h-full object-cover"
                />) : (
                    <p className="small-medium flex-center p-2">
                        <span>{post?.caption?.slice(0, 144) + '...'}</span>
                    </p>
                )}
            </Link>
            <div className="grid-post_user">
                {showUser && <Link to={`/profile/${post?.creator?.$id}`} className="flex items-center gap-2 flex-1">
                    <Image
                        src={post?.creator?.profileImage}
                        alt="creator"
                        className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1 small-regular shadow-sm">{post?.creator?.username}</p>
                </Link>}
                {showStats && <PostStats post={post} userId={user?.id} />}
            </div>
        </li>)}
    </ul>
  )
}

export default GridPostList