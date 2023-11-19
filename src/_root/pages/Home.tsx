import { useGetInfinitePosts} from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import PostCard from "@/lib/shared/PostCard"
import { Models } from "appwrite"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

export default function Home() {
  const {data: posts, fetchNextPage, hasNextPage} = useGetInfinitePosts()
  const { ref, inView } = useInView()

  useEffect(()=>{
    if (inView) fetchNextPage()
  },[inView, fetchNextPage])

  if (!posts) return <div className="flex w-full h-full">
    <Loader/>
  </div>

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="text-left w-full md:h3-bold h2-bold">
            Home Feeds
          </h2>
          {posts.pages.map((post, index) => <ul className="flex flex-1 flex-col gap-9 w-full" key={`home-post-${index}`}>
              {post?.documents.map((post: Models.Document) => (
                <li key={post.$id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>)}
          <div className="mt-10" ref={ref}>
            {hasNextPage && (
              <Loader />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
