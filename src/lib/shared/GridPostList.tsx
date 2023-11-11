import { useUserAuth } from "@/context/AuthContext"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"

function GridPostList({posts, showUser=true, showStats=true}: {posts?: Models.Document[], showUser?:boolean, showStats?:boolean}) {
    const { user } = useUserAuth()
  return (
    <ul className="grid-container">
        {posts?.map(post => <li key={post?.$id} className="relative w-min-80 h-80">
            <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img
                    src={post?.imageUrl}
                    alt="explore-image"
                    className="w-full h-full object-cover"
                />
            </Link>
            <div className="grid-post_user">
                {showUser && <div className="flex items-center gap-2 flex-1">
                    <img
                        src={post?.creator?.profileImage}
                        alt="creator"
                        className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1 small-regular shadow-sm">{post?.creator?.name}</p>
                </div>}
                {showStats && <PostStats post={post} userId={user?.id} />}
            </div>
        </li>)}
    </ul>
  )
}

export default GridPostList