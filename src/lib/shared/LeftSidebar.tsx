import { Button } from "@/components/ui/button"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { useSignOut } from "../react-query/queriesAndMutations"
import { useEffect } from "react"
import { useUserAuth } from "@/context/AuthContext"
import { sidebarLinks } from "@/constants"
import { INavLink } from "@/types"

function LeftSidebar() {
    const { mutate: signOut, isSuccess } = useSignOut()
    const navigate= useNavigate()
    const { user } = useUserAuth()
    const {pathname} = useLocation()

    useEffect(() => {
        if (isSuccess) {
            navigate(0)
        }
    }, [isSuccess, navigate])

  return (
    <nav className="leftsidebar">
        <div className="flex flex-col gap-11">
            <Link to={'/'} className="flex items-center gap-x-2">
                <img
                    src="/assets/images/slide_2.svg"
                    className="object-cover rounded-full"
                    width={40}
                    height={40}
                    alt="logo"
                />
                <span className="font-bold text-xl text-primary-600">Lawgram.</span>
            </Link>
            <Link to={`/profile/${user?.id}`} className="flex gap-3 items-center">
                <img
                    src={user.profileImage || '/assets/icons/profile-placeholder.svg'}
                    width={40}
                    height={40}
                    className="object-cover rounded-full gap-3"
                    alt={user?.username}
                />
                <div className="flex flex-col">
                    <p className="body-bold">{user.name}</p>
                    <p className="small-regular text-light-3 font-thin">@{user.username}</p>
                </div>
            </Link>
            <ul className="flex flex-col gap-3">
                {sidebarLinks.map((link: INavLink) => {
                    const isActive = pathname === link.route
                    return <li className={`leftsidebar-link group ${isActive && 'text-primary-600'}`} key={link.label}>
                        <NavLink to={link.route} className="flex gap-4 p-4">
                            <img
                                src={link.imgURL}
                                alt="link.label"
                                className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                            />
                            {link.label}
                        </NavLink>
                    </li>
                })}
            </ul>
        </div>
        <Button onClick={() => signOut()} variant="ghost" className="shad-button_ghost flex items-center gap-4 p-4">
            <img src="/assets/icons/logout.svg"/>
            <span className="small-regular text-light-2">Logout</span> 
        </Button>
    </nav>
  )
}

export default LeftSidebar