import { useGetCurrentUser, useGetUser, useGetUserPosts } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/lib/shared/Loader"
import { Link, useNavigate, useParams } from "react-router-dom"
import GridPostList from "@/lib/shared/GridPostList"
import ProcessedPost from "../ProcessedPost"
import { Chip, Tab, Tabs } from "@nextui-org/react"

function Profile() {
  const {id} = useParams()
  const {data: user, isPending} = useGetUser(id || '')
  const {data: currentUser} = useGetCurrentUser()
  
  const {data: posts, isPending: isGettingUserPosts} = useGetUserPosts(user?.$id || '')
  const navigate = useNavigate()
  
  if (isPending) return <Loader/>
  

  if (!user) {
    navigate('/not-found')
    return <></>
  }

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
        <div className="flex w-full flex-col">
          <Tabs 
            aria-label="Options" 
            color="primary" 
            variant="underlined"
            classNames={{
              tabList: "gap-12 w-full relative flex rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab
              key="posts"
              title={
                <div className="flex items-center space-x-2">
                  <img
                    src="/assets/icons/wallpaper.svg"
                    alt="pictures"
                    width={18}
                    height={18}
                  />
                  <span>Posts by {currentUser?.$id === user.$id ? "You" : user?.username}</span>
                  <Chip size="sm" variant="solid" color="primary">{isNaN(Number(posts?.total)) ? 0 : posts?.total  }</Chip>
                </div>
              }
            >
              <div className='flex w-full max-w-5xl flex-col gap-4 py-6'>
                <h3 className="h3-bold md:h2-bold tracking-widest text-light-2"><span className="text-primary-600">{isNaN(Number(posts?.total)) ? 0 : posts?.total }</span> post{posts?.documents?.length === 1 ? '': 's'}.</h3>
                {isGettingUserPosts ? <Loader /> : <GridPostList posts={posts?.documents} showUser={false}/>}
              </div>
            </Tab>
            <Tab
              key="liked"
              title={
                <div className="flex items-center space-x-2">
                  <img
                    src="/assets/icons/liked.svg"
                    alt="pictures"
                    width={18}
                    height={18}
                  />
                  <span>Liked Posts</span>
                  <Chip size="sm" variant="solid" color="secondary">{user?.liked?.length}</Chip>
                </div>
              }
            >
              <div className='flex w-full max-w-5xl flex-col gap-4 py-6'>
                <h3 className="h3-bold md:h2-bold tracking-widest text-light-2"><span className="text-primary-600">{user?.liked?.length}</span> post{posts?.documents?.length === 1 ? '': 's'}.</h3>
                {isPending ? <Loader /> : <GridPostList isLiked={true} posts={user?.liked} showUser={true} showStats={false}/>}
              </div>
            </Tab>
          </Tabs>
        </div>  
      </div>
    </div>
  )
}

export default Profile