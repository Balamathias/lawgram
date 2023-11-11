import { bottombarLinks } from "@/constants"
import { Link, useLocation } from "react-router-dom"

function Bottombar() {
  const { pathname } = useLocation()
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
          const isActive = pathname === link.route
          return (
              <Link key={link.label} to={link.route} className={`flex flex-center max-xs:flex-col gap-1 p-4 transition ${isActive && 'text-primary-600'}`}>
                  <img
                      src={link.imgURL}
                      alt="link.label"
                      width={16}
                      height={16}
                      className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                  />
                  <p className="text-tiny text-sm tiny-medium">{link.label}</p>
              </Link>)
      })}
    </section>
  )
}

export default Bottombar