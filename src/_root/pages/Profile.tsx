import { useGetCurrentUser, useGetUser, useGetUserPosts } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GridPostList from "@/lib/shared/GridPostList"
import ProcessedPost from "../ProcessedPost"

function Profile() {
  const {id} = useParams()
  const {data: user, isPending} = useGetUser(id || '')
  const {data: currentUser} = useGetCurrentUser()
  
  const {data: posts, isPending: isGettingUserPosts} = useGetUserPosts(user?.$id || '')
  const navigate = useNavigate()
  
  if (isPending) return <Loader/>
  

  if (!user) return navigate('/not-found')

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex max-w-5xl md:justify-start w-full justify-start gap-3">
          <div className="flex md:flex-row flex-col gap-10 md:items-start">
            <img
              src={user?.profileImage || '/assets/icons/profile-placeholder.svg'}
              alt="profile"
              className="rounded-full h-40 w-40 object-cover"
            />
            <div className="flex flex-col w-full gap-5">
              <div className="flex md:items-start gap-6 md:gap-16">
                <div className="flex gap-3 flex-col">
                  <h3 className="h3-bold md:h2-bold text-light-2">{user?.name}</h3>
                  <p className="small-medium text-light-3 mt-1">@{user?.username}</p>
                </div>
                {currentUser?.$id === user?.$id && 
                <Link to={`/update-profile/${user?.$id}`} className="flex gap-2 items-center rounded-lg py-4 px-6 bg-dark-4 shadow">
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit-profile"
                    width={14}
                    height={14}
                  />
                  <p className="small-medium text-light-3">
                    Edit Profile
                  </p>
                </Link>}
              </div>
              <div className="text-light-2 base-medium mt-6 mb-4">
                <ProcessedPost content={user?.bio} />
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue="pictures" className="w-full max-w-5xl flex-1">
          <TabsList className="flex gap-2 w-full justify-start">
            <TabsTrigger value="pictures" className="rounded-lg py-4 px-6 bg-dark-4 shadow">
              <img
                src="/assets/icons/wallpaper.svg"
                alt="pictures"
                width={18}
                height={18}
              />
              <p className="small-medium ml-2 text-light-3">
                Picture
              </p>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pictures" className='flex w-full max-w-5xl flex-col gap-4 py-6'>
            <h3 className="h3-bold md:h2-bold tracking-widest text-light-2"><span className="text-primary-600">{posts?.documents?.length}</span> post{posts?.documents?.length === 1 ? '': 's'}.</h3>
            {isGettingUserPosts ? <Loader /> : <GridPostList posts={posts?.documents} showUser={false}/>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Profile