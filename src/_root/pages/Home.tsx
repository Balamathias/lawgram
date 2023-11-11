import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import PostCard from "@/lib/shared/PostCard"
import { Models } from "appwrite"

export default function Home() {
  const {data: posts, isPending: isPostsLoading, isError: isPostError} = useGetRecentPosts()

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="text-left w-full md:h3-bold h2-bold">
            Home Feeds
          </h2>
          {isPostsLoading && !posts ? <Loader /> : (
            <ul className="flex flex-1 flex-col gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </ul>
          ) }
        </div>
      </div>
    </div>
  )
}
