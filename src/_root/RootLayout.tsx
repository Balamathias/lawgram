import Bottombar from "@/lib/shared/Bottombar"
import LeftSidebar from "@/lib/shared/LeftSidebar"
import Topbar from "@/lib/shared/Topbar"
import { Outlet } from "react-router-dom"

function RootLayout() {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  )
}

export default RootLayout