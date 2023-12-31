import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { multiFormatDateString } from "../utils"
import { useUserAuth } from "@/context/AuthContext"
import PostStats from "./PostStats"
import ProcessedPost from "@/_root/ProcessedPost"
import { Image } from "@nextui-org/react"

function PostCard({post}: {post: Models.Document}) {
    const { user } = useUserAuth()
    if (!post.creator) return
    
  return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post?.creator?.$id}`}>
                    <Image 
                    src={post?.creator?.profileImage || '/assets/icons/profile-placeholder.svg'}
                    alt="profile_image"
                    className="w-12 lg:h-12 object-cover rounded-full" 
                    />
                </Link>
                <div className="flex flex-col gap-3">
                    <p className="base-medium flex items-center gap-2 text-light-2 lg:body-bold"><span>@{post?.creator?.username}</span> {post?.creator?.email === 'balamathias40@gmail.com' && <Image
                        src="/assets/icons/twitter-verified-badge.svg"
                        alt="badge"
                        width={20}
                        height={20}
                    />}</p>
                    <div className="flex flex-center gap-3">
                        <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)}</p>
                        -
                        <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                    </div>
                </div>
            </div>
            <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post.creator.$id && "hidden"}`}>
                <Image
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={16}
                />
            </Link>
        </div>
        <Link to={`/posts/${post.$id}`}>
            <div className="small-medium lg:base-medium py-5">
                <div className="base-medium tracking-normal text-light-2 leading-9">
                    <ProcessedPost content={post?.caption.slice(0, 496) + `${post?.caption?.at(497) ? '...' : ''}`} />
                    {post?.caption?.at(497) ? <Link to={'/posts/' + post?.$id} className="text-fuchsia-400">...see more</Link> : ''}
                </div>
                <ul className="flex gap-1 mt-2">
                    {post.tags.length > 0 ? (post.tags.map((tag: string) => <li>
                        <Link to={`/posts/tags?tag=${tag}`} className="text-primary-600" key={tag + Math.random()}>{tag && '#' }{tag}</Link>
                    </li>)): ''}
                </ul>
            </div>
        </Link>
        {post?.imageUrl && <img 
            src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} 
            alt="post-image"
            sizes="1024×1024" 
            className="post-card_img"
             
        />}
        <PostStats post={post} userId={user.id} />
    </div>
  )
}

export default PostCard