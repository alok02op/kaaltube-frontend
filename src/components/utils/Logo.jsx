import { Link } from "react-router-dom"

function Logo() {
  return (
    <Link to="/" className="hidden sm:flex items-center justify-center p-0 text-xl sm:text-2xl md:text-3xl font-bold mr-2">
        KaalTube
    </Link>
  )
}

export default Logo
