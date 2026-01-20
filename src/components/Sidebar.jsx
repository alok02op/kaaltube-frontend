import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LogoutBtn } from '../components'
import { Button } from '@/components/ui/button'
import { useLocation } from "react-router-dom";


const Sidebar = ({ sidebarOpen, topBarHeight = '64' }) => {
  const authStatus = useSelector(state => state.auth.status)
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', route: '/', active: true },
    { name: 'Login', route: '/login', active: !authStatus },
    { name: 'Sign Up', route: '/sign-up', active: !authStatus },
    { name: 'Likes', route: '/likes', active: authStatus },
    { name: 'Watch History', route: '/watch-history', active: authStatus },
    { name: 'Subscriptions', route: '/subscribedto', active: authStatus },
    { name: 'My Channel', route: '/channel', active: authStatus },
    { name: 'My Profile', route: '/profile', active: authStatus }
  ]

  return (
    <aside
      style={{ top: `${topBarHeight}px` }}
      className={`fixed left-0 w-64 h-full bg-zinc-900 text-white z-40 transform transition-transform duration-300
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className={`flex flex-col justify-start`}>
        {/* Navigation */}
        <ul className="flex flex-col gap-2 p-4 flex-1">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start px-4 py-2 rounded cursor-pointer transition-colors
                        ${location.pathname === item.route ? 
                          "bg-white text-black" : 
                          "hover:bg-blue-700 hover:text-white text-white"
                        }
                    `}
                    onClick={() => navigate(item.route)}
                  >
                    {item.name}
                  </Button>
                </li>
              )
          )}
        </ul>

        {/* Logout */}
        {authStatus && (
          <div className="p-4 sm:hidden">
            <LogoutBtn />
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar