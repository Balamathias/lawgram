import { getCurrentUser } from "@/lib/appwrite/api"
import { IUser, IcontextType } from "@/types"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const USER_INITIALS: IUser = {
    id: '',
    name: '',
    email: '',
    username: '',
    bio: '',
    profileImage: ''
}

const INITIAL_STATE = {
    user: USER_INITIALS,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkUser: async () => false as boolean 
}


const authContext = createContext<IcontextType>(INITIAL_STATE)


function AuthProvider({children}: { children: React.ReactNode}) {
    const [user, setUser] = useState<IUser>(USER_INITIALS)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    const navigate = useNavigate()

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser()
            if (currentUser) {
                setUser({
                    id: currentUser.$id,
                    name: currentUser?.name,
                    email: currentUser?.email,
                    username: currentUser?.username,
                    bio: currentUser?.bio,
                    profileImage: currentUser?.profileImage
                })
                setIsAuthenticated(true)
                return true
            }
            return false
        } catch (error) {
            console.log(error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('cookieFallback') === '[]') {
            navigate('/sign-in')
        } 
        // else if (localStorage.getItem('cookieFallback') === null) navigate('/sign-up')
        else checkUser()
    }, [navigate])
    
    const value = {
        user: user,
        isLoading: isLoading,
        isAuthenticated: isAuthenticated,
        setUser: setUser,
        setIsAuthenticated: setIsAuthenticated,
        checkUser: checkUser 
    }

  return (
    <authContext.Provider value={value}>{ children }</authContext.Provider>
  )
}

export default AuthProvider

export const useUserAuth = () => useContext(authContext)