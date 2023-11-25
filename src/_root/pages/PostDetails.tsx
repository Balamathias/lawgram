import { useUserAuth } from "@/context/AuthContext"
import { useGetPostById, useGetPostComments, useGetPosts } from "@/lib/react-query/queriesAndMutations"
import CommentForm from "@/components/CommentForm"
import GridPostList from "@/lib/shared/GridPostList"
import Loader from "@/lib/shared/Loader"
import PostStats from "@/lib/shared/PostStats"
import { multiFormatDateString } from "@/lib/utils"
import { Models } from "appwrite"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Link, useParams } from "react-router-dom"
import CommentCard from "@/lib/shared/CommentCard"
import ProcessedPost from "../ProcessedPost"
import { Image } from "@nextui-org/image"
import PostActions from "@/lib/shared/PostActions"

function PostDetails() {
  const {data: posts, fetchNextPage, hasNextPage} = useGetPosts()
  const {ref, inView} = useInView()
  
  const {id} = useParams()
  const {data: post, isPending} = useGetPostById(id || '')
  const { user } = useUserAuth()

  const {data: comments, isPending: isCommentsPending} = useGetPostComments(post?.$id || '')

  useEffect(()=>{
    if (inView) fetchNextPage()
  },[inView, fetchNextPage])

  

  if (isPending) return <Loader />
  return (
    <div className="post_details-container">
        <div className="post_details-card">
            {post?.imageUrl && 
            <img
              className="post_details-img rounded-md"
              src={post?.imageUrl}
              alt="post"
            />}
            <div className="post_details-info">
              <div className="flex-between w-full">
                <Link to={`/profile/${post?.creator?.$id}`} className="flex max-[480px]:flex-col max-[480px]:items-start items-center gap-4">
                  <Image 
                  src={post?.creator?.profileImage || '/assets/icons/profile-placeholder.svg'}
                  alt="profile_image"
                  className="w-12 lg:h-12 object-cover rounded-full" 
                  />
                  <div className="flex flex-col gap-3">
                      <p className="base-medium flex gap-2 items-center text-light-2 lg:body-bold">
                      <span>@{post?.creator?.username}</span> {post?.creator?.email === 'balamathias40@gmail.com' && <Image
                        src="/assets/icons/twitter-verified-badge.svg"
                        alt="badge"
                        width={20}
                        height={20}
                    />}
                      </p>
                      <div className="flex flex-center gap-3 max-[480px]:flex-col max-[480px]:items-start">
                          <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)}</p>
                          -
                          <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                      </div>
                  </div>
                </Link>
                <PostActions post={post} user={user}/>
              </div>
              <hr className="border border-dark-4/80 w-full" />
              <div className="small-medium lg:base-medium py-5 flex flex-1 flex-col gap-4 w-full">
                <div className="base-medium">
                  <ProcessedPost content={post?.caption} />
                </div>
                <ul className="flex gap-1 mt-2">
                    {post?.tags.map((tag: string) => <Link to={`/posts/tags?tag=${tag}`} className="text-primary-600" key={tag}>{tag && '#'}{tag}</Link>)}
                </ul>
              </div>
              <div className="w-full">
                <PostStats post={post} userId={user.id} />
              </div>
            </div>
        </div>
          <div className="w-full flex-1 max-w-5xl" id="comments">
            <CommentForm postId={post?.$id || ''} />

            <div className="w-full flex justify-start max-w-5xl flex-col gap-7">
              {comments?.documents.length === 0 ? 
                <p className="subtle-medium text-light-2 py-6">No comments for this post yet.</p> :<>
                <h2 className="body-bold mt-6">Comments</h2>
                <div className="w-full max-w-5xl flex-col flex gap-5 py-7">
                  {comments?.documents.map(comment => <CommentCard comment={comment} key={comment.$id} />)}
                </div></>}
                {isCommentsPending && <Loader />}
              </div>
            </div>

        {!posts ? <Loader /> : (
        <div className="w-full flex justify-start max-w-5xl flex-col gap-7">
          <h2 className="body-bold">More related Posts</h2>
          { posts.pages.map((post_, index) => (
            <GridPostList key={`page-${index}`} posts={post_?.documents.filter((item: Models.Document) => item !== post)}/>
          ))}
        </div>)}
        <div className="mt-10" ref={ref}>
        {hasNextPage && (
          <Loader />
        )}
      </div>
    </div>
  )
}

export default PostDetails