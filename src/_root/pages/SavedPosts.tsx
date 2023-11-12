import { useGetCurrentUser, useGetSavedPosts } from "@/lib/react-query/queriesAndMutations"
import GridPostList from "@/lib/shared/GridPostList"
import Loader from "@/lib/shared/Loader"

function SavedPosts() {
  const {data: currentUser} = useGetCurrentUser()
  const {data:savedPosts, isPending} = useGetSavedPosts(currentUser?.$id || '')
  const filteredSavedPosts = savedPosts?.documents?.map(doc => doc.post).reduce((acc, curr) => acc.concat(curr), [])

  if (isPending) return <Loader />

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex max-w-5xl items-center w-full justify-start gap-3">
          <img
            src="/assets/icons/saved.svg"
            alt="add post"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold gap-3 text-left w-full">Your Saved Posts</h2>
        </div>
        <div className="flex w-full max-w-5xl justify-start">
          {  filteredSavedPosts?.length === 0 || !savedPosts ? <p className="text-light-200 text-sm small-regular w-full-py-10">You do not have any saved posts yet.</p> : 
          <GridPostList 
            posts={filteredSavedPosts}
            showStats={true}
            />}
        </div>
      </div>
    </div>
  )
}

export default SavedPosts