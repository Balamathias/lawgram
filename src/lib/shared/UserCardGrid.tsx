import { Button } from "@/components/ui/button"
import { Image } from "@nextui-org/react"
import { Models } from "appwrite"
import { Link } from "react-router-dom"

function UserCardGrid({users, topCreators}: {users?: Models.Document[], topCreators?: boolean}) {
  return (
    <div className={topCreators ? "flex gap-5 w-full max-w-full flex-wrap" : "flex gap-5 w-full max-w-5xl flex-wrap md:justify-start justify-center"}>
      {users?.map(user => <Link to={`/profile/${user.$id}`} key={user.$id} className="user-card flex-center gap-5">
          <Image src={user?.profileImage} alt="profile" className="w-20 h-20 object-cover rounded-full" />
          <h2 className="body-bold text-light-2">{user?.name}</h2>
          <p className="subtle-medium text-light-2 text-sm">@{user?.username}</p>
          <Button className="bg-primary-600">
              Follow
          </Button>
      </Link>)}
    </div>
  )
}

export default UserCardGrid