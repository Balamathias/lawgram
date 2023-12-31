import { Models } from "appwrite"
import Loader from "./Loader"
import GridPostList from "./GridPostList"

function SearchResults({posts, isSearching, debounceValue}: {posts: Models.Document[] | undefined, isSearching: boolean, debounceValue: string}) {
    if (isSearching) return <Loader />
    if (!posts) return

    if (posts?.length > 0) return <GridPostList posts={posts} />
  return (
    <p className="small-regular text-light-2">No Search results for <b className="text-primary-600 font-bold">{debounceValue}</b></p>
  )
}

export default SearchResults