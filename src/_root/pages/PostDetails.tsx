import { useUserAuth } from "@/context/AuthContext"
import { useDeletePost, useGetPostById, useGetPostComments, useGetPosts } from "@/lib/react-query/queriesAndMutations"
import CommentForm from "@/components/CommentForm"
import GridPostList from "@/lib/shared/GridPostList"
import Loader from "@/lib/shared/Loader"
import PostStats from "@/lib/shared/PostStats"
import { multiFormatDateString } from "@/lib/utils"
import { Models } from "appwrite"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Link, useNavigate, useParams } from "react-router-dom"
import CommentCard from "@/lib/shared/CommentCard"
import ProcessedPost from "../ProcessedPost"
import useCopyLink from "@/parsers/useCopyLink"
import toast from "react-hot-toast"
import { Button, Image, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/react"

function PostDetails() {
  const {data: posts, fetchNextPage, hasNextPage} = useGetPosts()
  const {ref, inView} = useInView()
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const {id} = useParams()
  const {data: post, isPending} = useGetPostById(id || '')
  const { user } = useUserAuth()
  const {mutateAsync: deletePost, isPending: isDeleting} = useDeletePost()
  const navigate = useNavigate()

  const {isCopied, copyLink} = useCopyLink()

  const {data: comments, isPending: isCommentsPending} = useGetPostComments(post?.$id || '')

  useEffect(()=>{
    if (inView) fetchNextPage()
  },[inView, fetchNextPage])

  const handleDeletePost = () => {
    deletePost({postId: post?.$id || '', imageId: post?.imageId},{
      onSuccess() {
          navigate('/')
          onOpenChange()
          return toast.success("Post deleted successfully.")
      },
    })
  }

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
                <Link to={`/profile/${post?.creator?.$id}`} className="flex items-center gap-4">
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
                      <div className="flex flex-center gap-3">
                          <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)}</p>
                          -
                          <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                      </div>
                  </div>
                </Link>
                <div className="flex-center gap-4">
                  <div className={`flex-center`}>
                      {isCopied ? (
                        <Image 
                          src="/assets/icons/checkmark.svg"
                          alt="edit"
                          width={24}
                          height={24}
                          title="Copied."
                          className="cursor-pointer"
                        />
                      ) : (
                        <Image
                          src="/assets/icons/share.svg"
                          alt="edit"
                          width={24}
                          height={24}
                          title="Copy link to this post."
                          className="cursor-pointer"
                          onClick={copyLink}
                      />
                      )}
                  </div>
                  <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id ? "hidden" : ""}`}>
                      <Image
                          src="/assets/icons/edit.svg"
                          alt="edit"
                          width={24}
                          height={24}
                      />
                  </Link>
                  <div className={`${user.id !== post?.creator.$id ? "hidden" : ""}`}>
                    <div className="flex-1 py-4 max-w-5xl">
                      <Button onPress={onOpen} className="border-none bg-dark-2 flex-center w-12 h-12 rounded-full">
                        <Image
                            src="/assets/icons/delete.svg"
                            width={24}
                            height={24}
                            alt="delete"
                          />
                      </Button>
                    </div>
                    <Modal 
                      isOpen={isOpen} 
                      onOpenChange={onOpenChange}
                      placement="center"
                      backdrop="opaque"
                    >
                      <ModalContent className="bg-dark-2 p-4 shadow-2xl border border-rose-700">
                        {(onClose) => (
                          <>
                          <ModalBody>
                            <div className="py-6 flex flex-col gap-3 px-6 rounded-lg shadow z-20 bg-dark-2 border-rose-900">
                              <p className="text-rose-700 base-medium">Are you sure you want to delete this post? This action cannot be undone!</p>
                            </div>
                              <ModalFooter>
                                <Button color="primary" variant="solid" onPress={onClose} className="rounded-[50px]">
                                  Close
                                </Button>
                                <Button variant={'flat'} color="danger" isLoading={isDeleting} className={`ghost_details-delete_btn border justify-end flex items-center gap-3 w-fit`}
                                onClick={handleDeletePost}
                              >
                                {!isDeleting && <Image src="/assets/icons/delete.svg" alt="delete" width={16} height={16} />}
                                <span>Delet{isDeleting ? 'ing...': 'e'}</span>
                              </Button>
                              </ModalFooter>
                          </ModalBody>
                          </>
                        )}
                      </ModalContent>
                  </Modal>
                  </div>
                </div>
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
          <div className="w-full flex-1 max-w-5xl">
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