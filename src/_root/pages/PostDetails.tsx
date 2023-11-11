import { Button } from "@/components/ui/button"
import { useUserAuth } from "@/context/AuthContext"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import PostStats from "@/lib/shared/PostStats"
import { multiFormatDateString } from "@/lib/utils"
import { Link, useParams } from "react-router-dom"

function PostDetails() {

  const {id} = useParams()
  const {data: post, isPending} = useGetPostById(id || '')
  const { user } = useUserAuth()

  if (isPending) return <Loader />
  return (
    <div className="post_details-container">
        <div className="post_details-card">
            <img
              src={post?.imageUrl}
              alt="post"
              className="post_details-img"
            />
            <div className="post_details-info">
              <div className="flex-between w-full">
                <Link to={`/profile/${post?.creator?.$id}`} className="flex items-center gap-4">
                  <img 
                  src={post?.creator?.profileImage || '/assets/icons/profile-placeholder.svg'}
                  alt="profile_image"
                  className="w-12 lg:h-12 object-cover rounded-full" 
                  />
                  <div className="flex flex-col gap-3">
                      <p className="base-medium text-light-2 lg:body-bold">{post?.creator?.name}</p>
                      <div className="flex flex-center gap-3">
                          <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)}</p>
                          -
                          <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                      </div>
                  </div>
                </Link>
                <div className="flex-center gap-4">
                  <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && "hidden"}`}>
                      <img
                          src="/assets/icons/edit.svg"
                          alt="edit"
                          width={24}
                          height={24}
                      />
                  </Link>
                  <Button variant={'ghost'} className="ghost_details-delete_btn">
                    <img
                      src="/assets/icons/delete.svg"
                      width={24}
                      height={24}
                      alt="delete"
                    />
                  </Button>
                </div>
              </div>
              <hr className="border border-dark-4/80 w-full" />
              <div className="small-medium lg:base-medium py-5 flex flex-1 flex-col gap-4 w-full">
                <p className="base-medium">{post?.caption}</p>
                <ul className="flex gap-1 mt-2">
                    {post?.tags.map((tag: string) => <Link to={`/tags?q=${tag}`} className="text-primary-600" key={tag}>#{tag}</Link>)}
                </ul>
              </div>
              <div className="w-full">
                <PostStats post={post} userId={user.id} />
              </div>
            </div>
        </div>
    </div>
  )
}

export default PostDetails