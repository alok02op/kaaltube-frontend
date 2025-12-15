import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authService, videoService, subscriptionService } from './backend'
import { Sidebar, Loader, SearchBar, Logo, MiniVideoPlayer, LogoutBtn } from './components'
import { Outlet } from 'react-router-dom'
import { 
    login, 
    logout, 
    setAllVideos, 
    setVideos, 
    setAuthLoaded, 
    setLikedVideos, 
    setWatchHistory, 
    setChannelList, 
    setUserChannel
} from './store'

const App = () => {
    const authStatus = useSelector(state => state.auth.status);
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        return localStorage.getItem('sidebarOpen') === 'true'
    })
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();

    const miniPlayerIsOpen = useSelector(state => state.miniPlayer.isOpen);
    const miniPlayerVideo = useSelector(state => state.miniPlayer.video);

    useEffect(() => {
        setLoading(true)
        Promise.all([
            videoService.getAllVideos().then((allVideos) => {
                dispatch(setAllVideos(allVideos));
            }),
            authService.getCurrentUser().then((userData) => {
                if (userData) dispatch(login({ ...userData }));
                else dispatch(logout());
            })
        ])
        .then(async () => {
            // now user/token is set, safe to call
            try {
                const videos = await videoService.getWatchHistory();
                dispatch(setWatchHistory(videos));
            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
            }
            try {
                const likedVideos = await videoService.getLikedVideos();
                dispatch(setLikedVideos(likedVideos));
            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
            }
            try {
                const userVideos = await videoService.getUserVideos();
                dispatch(setVideos(userVideos));
            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
            }
            try {
                const channelList = await subscriptionService.getSubscribedChannels();
                dispatch(setChannelList(channelList));
            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
            }
            try {
                const userChannel = await subscriptionService.getUserChannelProfile();
                dispatch(setUserChannel(userChannel));
            } catch (error) {
                console.log(error?.response?.data?.message || error.message);
            }
        })
        .catch((error) => {
            console.log(error?.response?.data?.message || error.message || 'User not logged in');
        })
        .finally(() => {
            dispatch(setAuthLoaded(true));
            setLoading(false);
        });
    }, [dispatch])

    useEffect(() => {
        localStorage.setItem('sidebarOpen', sidebarOpen)
    }, [sidebarOpen])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800">
            
            {/* Top fixed bar: Hamburger + Header */}
            <div className="fixed h-[64px] top-0 left-0 right-0 z-50 flex items-center bg-white shadow-md p-2">
                {/* Hamburger button */}
                <button
                    className="p-2 bg-gray-900 text-white rounded-md shadow-md mr-4 cursor-pointer"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {sidebarOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
                <Logo />
                {/* SearchBar */}
                <SearchBar />
                {/* Logout */}
                {authStatus && (
                    <div className="p-4 hidden sm:block">
                        <LogoutBtn />
                    </div>
                )}
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main playing area */}
            <div className="flex flex-1"> {/* mt-16 = height of top bar */}
                {/* Sidebar */}
                <Sidebar sidebarOpen={sidebarOpen} />

                {/* Main content */}
                <main
                    className={`flex-1 p-2 transition-all duration-300 overflow-auto
                        ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}
                    >
                    <Outlet />
                </main>
            </div>
            {miniPlayerIsOpen && miniPlayerVideo && (
                <MiniVideoPlayer video={miniPlayerVideo}/>
            )}
        </div>
    )
}

export default App
