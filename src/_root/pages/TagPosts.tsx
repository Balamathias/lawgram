import { useGetPostsByTag} from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import PostCard from "@/lib/shared/PostCard"
import { Models } from "appwrite"
import { useSearchParams } from "react-router-dom"

export default function TagPosts() {
  const [searchParams] = useSearchParams()
  const tagValue = searchParams.get('tag')?.toLowerCase()
  const {data: posts, isPending} = useGetPostsByTag(tagValue || '')

  if (isPending) return <div className="flex w-full h-full">
    <Loader/>
  </div>

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="text-left w-full body-bold md:h3-bold">
            <span className="text-primary-600">#{tagValue}</span>
          </h2>
          {(posts?.documents.length === 0) ? <p className="small-regular w-full text-left mt-6 text-light-2">No posts found for <b className="text-primary-600 font-bold">{tagValue}</b></p> : (
          <ul className="flex flex-1 flex-col gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </ul>)}
        </div>
      </div>
    </div>
  )
}
