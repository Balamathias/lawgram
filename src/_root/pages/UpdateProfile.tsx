import ProfileForm from "@/components/ProfileForm"
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"

function UpdateProfile() {
  const {data: currentUser, isPending} = useGetCurrentUser()

  if (isPending) return <Loader/>
  
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex max-w-5xl items-center w-full justify-start gap-3">
          <img
            src="/assets/icons/edit.svg"
            alt="add post"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold gap-3 text-left w-full">Update Account</h2>
        </div>
        <ProfileForm user={currentUser}/>
      </div>
    </div>
  )
}

export default UpdateProfile