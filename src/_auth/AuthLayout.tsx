import { useUserAuth } from '@/context/AuthContext'
import { Outlet, Navigate } from 'react-router-dom'


function AuthLayout() {
  const {isAuthenticated} = useUserAuth()

  return (
    <>
      {isAuthenticated ? <Navigate to="/" /> : 
      
      <section className='flex gap-8 w-screen h-screen'
        style={{
          backgroundImage: 'url("/assets/images/mainlogo.png")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
      >
      
        <section className="flex flex-1 bg-dark-4 opacity-90 backdrop-blur-lg justify-center flex-col h-screen items-center py-auto common-container">
          <Outlet />
        </section>

      </section>   
    }
    </>
  )
}

export default AuthLayout