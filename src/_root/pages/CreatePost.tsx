import PostForm from "@/components/PostForm"

function CreatePost() {
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
          <h2 className="h3-bold md:h2-bold gap-3 text-left w-full">Create Post</h2>
        </div>
        <PostForm action="Create" />
      </div>
    </div>
  )
}

export default CreatePost