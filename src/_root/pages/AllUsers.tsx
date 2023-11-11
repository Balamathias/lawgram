import { useGetInfiniteUsers} from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import UserCardGrid from "@/lib/shared/UserCardGrid"


function AllUsers() {
  const {data: users, fetchNextPage, hasNextPage} = useGetInfiniteUsers()
  const { ref, inView } = useInView()

  useEffect(()=>{
    if (inView) fetchNextPage()
  },[inView, fetchNextPage])

  if (!users) return <div className="flex w-full h-full">
    <Loader/>
  </div>

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex max-w-5xl items-center w-full justify-start gap-3">
          <img
            src="/assets/icons/people.svg"
            alt="add post"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold gap-3 text-left w-full">All Users</h2>
        </div>
        {users.pages.map((user, index) => <UserCardGrid key={`user-card-${index}`} users={user?.documents} />)}
        <div className="mt-10" ref={ref}>
            {hasNextPage && (
              <Loader />
            )}
        </div>
      </div>
    </div>
  )
}

export default AllUsers