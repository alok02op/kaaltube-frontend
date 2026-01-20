import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin, setChannelList, setLikedVideos, setUserChannel, setVideos, setWatchHistory } from '../store'
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Logo, Loader } from '@/components'
import { authService, subscriptionService, videoService } from '../backend'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setError('')
        setLoading(true)
        const payload = {
            email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.identifier)
                ? data.identifier
                : undefined,
            username: !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.identifier)
                ? data.identifier
                : undefined,
            password: data.password
        }

        try {
            const loggedInUser = await authService.loginUser(payload)
            dispatch(authLogin(loggedInUser))
            videoService
                .getUserVideos()
                .then((videos) => {
                    dispatch(setVideos(videos));
                })
                .catch((error) => console.log(error.message || error?.response?.data?.message))
            videoService
                .getLikedVideos()
                .then((videos) => {
                    dispatch(setLikedVideos(videos))
                })
                .catch((error) => console.log(error.message || error?.response?.data?.message))
            videoService
                .getWatchHistory()
                .then((videos) => {
                    dispatch(setWatchHistory(videos))
                })
                .catch((error) => console.log(error.message || error?.response?.data?.message))
            subscriptionService
                .getSubscribedChannels()
                .then((channelList) => {
                    dispatch(setChannelList(channelList))
                })
                .catch((error) => console.log(error.message || error?.response?.data?.message))
            subscriptionService
                .getUserChannelProfile()
                .then((userChannel) => {
                    dispatch(setUserChannel(userChannel))
                })
                .catch((error) => console.log(error.message || error?.response?.data?.message))
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
                <Loader />
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 bg-gray-50">
            <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl p-8 sm:p-10 shadow-lg border border-black/10">
                
                {/* Logo */}
                <div className="mb-6 flex justify-center">
                    <span className="inline-block w-20 sm:w-24">
                        <Logo />
                    </span>
                </div>

                <CardHeader className="text-center">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Sign in to your account
                    </CardTitle>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/sign-up"
                            className="font-medium text-blue-600 hover:underline transition-colors duration-200"
                        >
                            Sign Up
                        </Link>
                    </p>
                </CardHeader>

                {/* Error */}
                {error && (
                    <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
                )}

                <CardContent>
                    {/* Form */}
                    <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">
                        <Input
                            label="Email or Username"
                            placeholder="Enter your email or username"
                            type="text"
                            {...register('identifier', { required: "This field is required" })}
                        />
                        {errors.identifier && (
                            <p className="text-red-600 mt-1 text-sm">{errors.identifier.message}</p>
                        )}

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            {...register('password', { required: "Password is required" })}
                        />
                        {errors.password && (
                            <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
                        )}

                        <div className="text-right text-sm mt-1">
                            <Link to="/" className="text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <Button type="submit" variant="default" className='w-full cursor-pointer'>
                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login













// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { login as authLogin } from '../store'
// import { Button, Input, Logo } from '../components'
// import { authService } from '../backend'
// import { useForm } from 'react-hook-form'
// import { useDispatch } from 'react-redux'

// const Login = () => {
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const { register, handleSubmit, formState: { errors } } = useForm()
//     const [error, setError] = useState('')

//     const login = async (data) => {
//         setError('')
//         // Decide if input is email or username
//         const payload = {
//         email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.identifier)
//             ? data.identifier
//             : undefined,
//         username: !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.identifier)
//             ? data.identifier
//             : undefined,
//         password: data.password
//         }

//         try {
//             const loggedInUser = await authService.loginUser(payload)
//             dispatch(authLogin(loggedInUser))
//             navigate('/')
//         } catch (err) {
//             setError(err.response?.data?.message || "Something went wrong")
//         }
//     }

//     return (
//         <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6">
//             <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-black/10">
//                 {/* Logo */}
//                 <div className="mb-6 flex justify-center">
//                     <span className="inline-block w-20 sm:w-24">
//                         <Logo />
//                     </span>
//                 </div>

//                 {/* Heading */}
//                 <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
//                     Sign in to your account
//                 </h2>
//                 <p className="mt-2 text-center text-sm text-gray-600">
//                     Don't have an account?{' '}
//                     <Link
//                         to="/sign-up"
//                         className="font-medium text-blue-600 hover:underline transition-colors duration-200"
//                     >
//                         Sign Up
//                     </Link>
//                 </p>
//                 {/* Error */}
//                 {error && (
//                     <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
//                 )}

//                 {/* Form */}
//                 <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">
//                     <Input
//                         label="Email or Username"
//                         placeholder="Enter your email or username"
//                         type="text"
//                         {...register('identifier', { required: "This field is required" })}
//                     />
//                     {(errors.identifier )&& (
//                         <p className="text-red-600 mt-4 text-center font-medium">
//                             {errors.identifier.message}
//                         </p>
//                     )}
//                     <Input
//                         label="Password"
//                         placeholder="Enter your password"
//                         type="password"
//                         {...register('password', { required: "Password is required" })}
//                     />
//                     {errors.password && (
//                         <p className="text-red-600 mt-4 text-center font-medium">
//                             {errors.password.message}
//                         </p>
//                     )}
//                     <div className="text-right text-sm mt-1">
//                         <Link to="/forgot-password" className="text-blue-600 hover:underline">
//                             Forgot Password?
//                         </Link>
//                     </div>
//                     <Button type="submit" className="w-full" variant="primary">
//                         Sign In
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Login
