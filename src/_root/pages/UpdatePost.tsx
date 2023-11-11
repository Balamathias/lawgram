import PostForm from "@/components/PostForm"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import { useParams } from "react-router-dom"

function UpdatePost() {
  const {id} = useParams()

  const {data: post, isPending} = useGetPostById(id || '')

  if (isPending) return <Loader/>

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex max-w-5xl items-center w-full justify-start gap-3">
          <img
            src="/assets/icons/add-post.svg"
            alt="add post"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold gap-3 text-left w-full">Edit Post</h2>
        </div>
        <PostForm post={post} action='Update' />
      </div>
    </div>
  )
}

export default UpdatePost