import { useGetInfiniteUsers } from "../react-query/queriesAndMutations"
import Loader from "./Loader"
import UserCardGrid from "./UserCardGrid"

function TopCreators() {
  const {data: users, isPending} = useGetInfiniteUsers()

  if (isPending) return <Loader/>

  return (
    <div className="flex w-full gap-3 flex-col overflow-scroll p-2 custom-scrollbar">
      <h2 className="w-full body-bold text-light-2 text-left py-6">Top Creators</h2>
      <div className="w-full">
        {users?.pages.map((user, index) => <UserCardGrid topCreators={true} key={`user-card-${index}`} users={user?.documents.slice(0, 10)} />)}
      </div>
    </div>
  )
}

export default TopCreators