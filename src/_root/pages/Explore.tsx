import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce"
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations"
import GridPostList from "@/lib/shared/GridPostList"
import Loader from "@/lib/shared/Loader"
import SearchResults from "@/lib/shared/SearchResults"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"


function Explore() {
  const {data: posts, fetchNextPage, hasNextPage} = useGetPosts()
  const [searchValue, setSearchValue] = useState('')
  const debounceValue = useDebounce(searchValue, 600)
  const {data: searchPosts, isPending: isSearching} = useSearchPosts(debounceValue)
  const {ref, inView} = useInView()

  useEffect(()=>{
    if (inView && !searchValue) fetchNextPage()
  },[inView, searchValue, fetchNextPage])

  if (!posts) return <div className="flex w-full h-full">
    <Loader/>
  </div>

  const shouldShowSearchResults = searchValue !== ''
  const showSearchPosts = !shouldShowSearchResults && posts?.pages?.every((item) => item?.documents?.length === 0)

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 bg-dark-4 w-full rounded-lg">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input 
            className="explore-search" 
            placeholder="Search for people, posts and tags." 
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-7 mb-6">
        <h2 className="body-bold md:h3-bold w-full">Popular today</h2>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl py-2 px-4 cursor-pointer">
          <p className="md:base-medium small-regular text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter"
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className="flex gap-9 flex-wrap w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults 
            isSearching={isSearching}
            posts={searchPosts}
            debounceValue={debounceValue}
          />
          ) : showSearchPosts ? <p className="small-regular text-light-2">End of page.</p> : 
          posts.pages.map((post, index) => (
            <GridPostList key={`page-${index}`} posts={post?.documents}/>
          ))
        }
      </div>
      <div className="mt-10" ref={ref}>
        {hasNextPage && !searchValue && (
          <Loader />
        )}
      </div>
    </div>
  )
}

export default Explore