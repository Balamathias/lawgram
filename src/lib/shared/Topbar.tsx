import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useGetCurrentUser, useSignOut } from "../react-query/queriesAndMutations"
import { useEffect } from "react"

function Topbar() {
    const { mutate: signOut, isSuccess } = useSignOut()
    const navigate= useNavigate()
    const { data: user } = useGetCurrentUser()

    useEffect(() => {
        if (isSuccess) {
            navigate(0)
        }
    }, [isSuccess, navigate])

  return (
    <section className="topbar">
        <div className="flex flex-between py-4 px-5">
            <Link to={'/'} className="flex gap-3 items-center">
                <h2 className="font-bold text-xl text-orange-500">Lawgram</h2>
            </Link>

            <div className="flex gap-3 items-center">
                <Button onClick={() => signOut()} variant="ghost" className="shad-button_ghost">
                    <img src="/assets/icons/logout.svg"/> 
                </Button>
                <Link to={`/profile/${user?.$id}`} className="flex-center">
                    <img
                        src={user?.profileImage || '/assets/icons/profile-placeholder.svg'}
                        width={40}
                        height={40}
                        className="object-cover rounded-full gap-3"
                        alt={user?.username}
                    />
                </Link>
            </div>
        </div>
    </section>
  )
}

export default Topbar