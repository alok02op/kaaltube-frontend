import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { AuthLayout, UpdateVideo } from './components'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {
  Home,
  Login,
  SignUp,
  Profile,
  Channel,
  Likes,
  WatchHistory,
  SubscribedTo,
  Video,
  SearchResult,
  ChannelPage
} from './pages'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App />,
    children: [
      {
        path:'/',
        element:<Home />
      },{
        path:'/login',
        element: (
          <AuthLayout authentication = {false}>
            <Login />
          </AuthLayout>
        )
      },{
        path:'/sign-up',
        element: (
          <AuthLayout authentication = {false}>
            <SignUp />
          </AuthLayout>
        )
      },{
        path:'/profile',
        element: (
          <AuthLayout authentication = {true}>
            <Profile />
          </AuthLayout>
        )
      },{
        path:'/channel',
        element: (
          <AuthLayout authentication = {true}>
            <Channel />
          </AuthLayout>
        )
      },{
        path:'/subscribedto',
        element: (
          <AuthLayout authentication = {true}>
            <SubscribedTo />
          </AuthLayout>
        )
      },{
        path:'/likes',
        element: (
          <AuthLayout authentication = {true}>
            <Likes />
          </AuthLayout>
        )
      },{
        path:'/watch-history',
        element: (
          <AuthLayout authentication = {true}>
            <WatchHistory />
          </AuthLayout>
        )
      },{
        path:'/:videoId/:currentTime',
        element: (
          <Video />
        )
      },
      {
        path:'/update/:videoId',
        element: (
          <AuthLayout authentication = {true}>
            <UpdateVideo />
          </AuthLayout>
        )
      },
      {
        path:'/search',
        element: <SearchResult />
      },
      {
        path:'/channel/:id',
        element: <ChannelPage /> 
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
