import { useUserAuth } from '@/context/AuthContext'
import { Outlet, Navigate } from 'react-router-dom'


function AuthLayout() {
  const {isAuthenticated} = useUserAuth()

  return (
    <>
      {isAuthenticated ? <Navigate to="/" /> : <>
      
        <section className="flex flex-1 justify-center flex-col h-screen items-center py-auto common-container">
          <Outlet />
        </section>

        <img
          src="/assets/images/slide_3.svg"
          className="h-full w-1/2 bg-no-repeat bg-transparent object-cover hidden xl:block"
          alt="Side Image"
        />
      </>}
    </>
  )
}

export default AuthLayout