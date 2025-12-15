import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store'
import { 
    Button, Input, Logo, AlertPopup,
    Card, CardHeader, CardContent, CardFooter, CardTitle
} from '@/components'
import { authService, cloudService } from '../backend'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Loader from '../components/utils/Loader.jsx'
import { Loader2, Upload } from "lucide-react";

const SignUp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [fileInfo, setFileInfo] = useState({
        avatarId: '',
        coverImageId: '',
        avatarUploaded: false,
        coverUploaded: false,
        uploadingAvatar: false,
        uploadingCover: false,
        loading: false
    })

    const [error, setError] = useState('')
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' })

    const showAlert = (type, message) => setAlert({ show: true, type, message })
    const closeAlert = () => setAlert({ ...alert, show: false })

    const { register, handleSubmit, formState: { errors }, watch } = useForm()
    const avatarFile = watch('avatar')
    const coverFile = watch('coverImage')

    const uploadAvatar = async () => {
        if (!avatarFile || avatarFile.length === 0) {
            showAlert('warning', 'Please select an image before uploading')
            return '';
        }
        setFileInfo(info => ({ ...info, uploadingAvatar: true, loading: true }))
        try {
            const id = await cloudService.uploadOnCloudinary(avatarFile[0], 'image')
            setFileInfo(info => ({ ...info, avatarId: id, avatarUploaded: true }))
            showAlert('success', 'Avatar uploaded successfully')
        } catch (err) {
            showAlert('error', err?.message || 'Avatar upload failed')
        } finally {
            setFileInfo(info => ({ ...info, uploadingAvatar: false, loading: false }))
        }
    }

    const uploadCoverImage = async () => {
        if (!coverFile || coverFile.length === 0) {
            showAlert('warning', 'Please select an image before uploading')
            return
        }
        setFileInfo(info => ({ ...info, uploadingCover: true, loading: true }))
        try {
            const id = await cloudService.uploadOnCloudinary(coverFile[0], 'image')
            setFileInfo(info => ({ ...info, coverImageId: id, coverUploaded: true }))
            showAlert('success', 'Cover image uploaded successfully')
        } catch (err) {
            showAlert('error', err?.message || 'Cover image upload failed')
        } finally {
            setFileInfo(info => ({ ...info, uploadingCover: false, loading: false }))
        }
    }

    const create = async (data) => {
        setError('')
        setFileInfo(info => ({ ...info, loading: true }))
        const userDetails = {
            fullName: data.name,
            username: data.username,
            email: data.email,
            password: data.password,
            avatar: fileInfo.avatarId,
            coverImage: fileInfo.coverImageId
        }
        try {
            const loggedInUser = await authService.registerUser(userDetails)
            dispatch(authLogin(loggedInUser))
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong")
        } finally {
            setFileInfo(info => ({ ...info, loading: false }))
        }
    }

    return (
        <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center px-4 sm:px-6 bg-gray-50">
            <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl p-8 sm:p-10 shadow-lg border border-black/10">
                
                {/* Logo */}
                <div className="mb-6 flex justify-center">
                    <span className="inline-block w-20 sm:w-24">
                        <Logo />
                    </span>
                </div>

                <CardHeader className="text-center">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Sign up to create account
                    </CardTitle>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:underline transition-colors duration-200"
                        >
                            Log In
                        </Link>
                    </p>
                </CardHeader>

                {error && (
                    <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
                )}

                <CardContent>
                    <form onSubmit={handleSubmit(create)} className="mt-6 space-y-5">
                        <Input
                            label="Full Name"
                            placeholder="Enter your name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

                        <Input
                            label="Username"
                            placeholder="Enter username (lowercase letters & digits only)"
                            {...register('username', { required: 'Username is required' })}
                        />
                        {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}

                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                validate: {
                                    matchPattern: value =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        'Email address must be valid'
                                }
                            })}
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

                        {/* Avatar upload */}
                        <div className='sm:flex sm:gap-2 sm:items-center'>
                            <Input
                                label="Avatar"
                                type="file"
                                accept="image/*"
                                {...register('avatar', { required: 'Avatar is required' })}
                                className='cursor-pointer w-1/2 mb-1'
                            />
                            {avatarFile?.length > 0 && !fileInfo.avatarUploaded && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    disabled={fileInfo.uploadingAvatar}
                                    onClick={uploadAvatar}
                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                >
                                {fileInfo.uploadingAvatar ? (
                                    <>
                                        <Loader2 className="mr-1 h-2 w-2 sm:mr-2 sm:h-4 sm:w-4 animate-spin" /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-1 h-2 w-2 sm:mr-2 sm:h-4 sm:w-4" /> Upload
                                    </>
                                )}
                                </Button>
                            )}
                        </div>
                        {errors.avatar && <p className="text-red-600 text-sm">{errors.avatar.message}</p>}

                        {/* Cover upload */}
                        <div className='sm:flex sm:gap-2 sm:items-center'>
                            <Input
                                id='coverImage'
                                label="Cover Image"
                                type="file"
                                accept="image/*"
                                {...register('coverImage')}
                                className='cursor-pointer w-1/2 mb-1'
                            />
                            {coverFile?.length > 0 && !fileInfo.coverUploaded && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    disabled={fileInfo.uploadingCover}
                                    onClick={uploadCoverImage}
                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                >
                                {fileInfo.uploadingCover ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" /> Upload
                                    </>
                                )}
                                </Button>
                            )}
                        </div>
                        {errors.coverImage && <p className="text-red-600 text-sm">{errors.coverImage.message}</p>}

                        <Button type="submit" className="w-full cursor-pointer">
                            Create Account
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <AlertPopup
                        show={alert.show}
                        type={alert.type}
                        message={alert.message}
                        onClose={closeAlert}
                    />
                </CardFooter>

                {fileInfo.loading && <Loader />}
            </Card>
        </div>
    )
}

export default SignUp









































// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { login as authLogin } from '../store'
// import { Button, Input, Logo, AlertPopup } from '../components'
// import { authService } from '../backend'
// import { useForm } from 'react-hook-form'
// import { useDispatch } from 'react-redux'
// import { cloudService } from '../backend'

// const SignUp = () => {
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const [fileInfo, setFileInfo] = useState({
//         avatarId: '',
//         coverImageId: '',
//         avatarUploaded: false,
//         coverUploaded: false,
//         uploadingAvatar: false,
//         uploadingCover: false,
//         loading: false
//     })

//     const [error, setError] = useState('')
//     const [alert, setAlert] = useState({
//         show: false,
//         type: 'success',
//         message: ''
//     });

//     const showAlert = (type, message) => {
//         setAlert({show: true, type, message})
//     }
//     const closeAlert = () => {
//         setAlert({...alert, show: false})
//     }
//     const { register, handleSubmit, formState: { errors }, watch } = useForm()

//     const avatarFile = watch('avatar');
//     const coverFile = watch('coverImage');

//     const uploadAvatar = async () => {
//         if (!avatarFile || avatarFile?.length == 0) {
//             showAlert('warning', 'Please select an image before uploading');
//             return;
//         }
//         setFileInfo((info) => ({...info, uploadingAvatar: true, loading: true}))
//         try {
//             const id = await cloudService.uploadOnCloudinary(avatarFile[0], 'image');
//             setFileInfo((info) => ({...info, avatarId: id}))
//             showAlert('success', 'Avatar uploaded successfully')
//             setFileInfo((info) => ({...info, avatarUploaded: true}))
//         } catch (error) {
//             showAlert('error', error?.message || 'Avatar upload failed')
//         } finally {
//             setFileInfo((info) => ({...info, uploadingAvatar: false, loading: false}))
//         }
//     }
//     const uploadCoverImage = async () => {
//         if (!coverFile || coverFile?.length == 0) {
//             showAlert('warning', 'Please select an image before uploading');
//             return;
//         }
//         setFileInfo((info) => ({...info, uploadingCover: true, loading: true}))
//         try {
//             const id = await cloudService.uploadOnCloudinary(coverFile[0], 'image');
//             setFileInfo((info) => ({...info, coverImageId: id}))
//             showAlert('success', 'Cover image uploaded successfully')
//             setFileInfo((info) => ({...info, coverUploaded: true}))
//         } catch (error) {
//             showAlert('error', error?.message || 'Cover image upload failed')
//         } finally {
//             setFileInfo((info) => ({...info, uploadingCover: false, loading: false}))
//         }
//     }

//     const create = async (data) => {
//         setError('')
//         setFileInfo((info) => ({...info, loading: true}))
//         const userDetails = {
//             fullName: data.name,
//             username: data.username,
//             email: data.email,
//             password: data.password,
//             avatar: fileInfo.avatarId,
//             coverImage: fileInfo.coverImageId
//         }
//         try {
//             const loggedInUser = await authService.registerUser(userDetails);
//             dispatch(authLogin(loggedInUser))
//             navigate('/')
//         } catch (error) {
//             setError(err.response?.data?.message || "Something went wrong")
//         } finally {
//             setFileInfo((info) => ({...info, loading: false}))
//         }
//     }
    
//     return (
//         <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center px-4 sm:px-6">
//             <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-black/10"> 
//                 {/* Logo */}
//                 <div className="mb-6 flex justify-center">
//                     <span className="inline-block w-20 sm:w-24">
//                         <Logo />
//                     </span>
//                 </div>

//                 {/* Heading */}
//                 <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
//                     Sign up to create account
//                 </h2>
//                 <p className="mt-2 text-center text-sm text-gray-600">
//                     Already have an account?{' '}
//                     <Link
//                         to="/login"
//                         className="font-medium text-blue-600 hover:underline transition-colors duration-200"
//                     >
//                         Log In
//                     </Link>
//                 </p>

//                 {/* Error */}
//                 {error && (
//                     <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
//                 )}

//                 {/* Form */}
//                 <form onSubmit={handleSubmit(create)} className="mt-8 space-y-5">
//                     <Input
//                         label="Full Name:"
//                         placeholder="Enter your name"
//                         {...register('name', { required: 'Name is required' })}
//                     />
//                     {errors.name && (
//                         <p className="text-red-600 mt-4 text-center font-medium">
//                             {errors.name.message}
//                         </p>
//                     )}
//                     <Input
//                         label="Username:"
//                         placeholder="Enter username (lowercase letters & digits only)"
//                         {...register('username', { required: 'Username is required' })}
//                     />
//                     {errors.username && (
//                         <p className="text-red-600 mt-4 text-center font-medium">
//                             {errors.username.message}
//                         </p>
//                     )}
//                     <Input
//                         label="Email:"
//                         placeholder="Enter your email"
//                         type="email"
//                         {...register('email', {
//                         required: 'Email is required',
//                         validate: {
//                             matchPattern: (value) =>
//                             /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
//                             'Email address must be valid',
//                         },
//                         })}
//                     />
//                     {errors.email && (
//                         <p className="text-red-600 mt-4 text-center font-medium">
//                             {errors.email.message}
//                         </p>
//                     )}
//                     <Input
//                         label="Password:"
//                         placeholder="Enter your password"
//                         type="password"
//                         {...register('password', { required: 'Password is required' })}
//                     />
//                     {errors.password && (
//                         <p className="text-red-600 mt-4 text-center font-medium">
//                             {errors.password.message}
//                         </p>
//                     )}
//                     <div className='flex gap-2 items-center justify-between'>
//                         <Input
//                             label="Avatar:"
//                             type="file"
//                             className="mb-4"
//                             accept="image/*"
//                             {...register('avatar', { required: 'Avatar is required' })}
//                         />
//                         { avatarFile?.length > 0 &&
//                         <Button 
//                             type='button'
//                             variant='primary'
//                             disabled={fileInfo.uploadingAvatar}
//                             onClick={uploadAvatar}
//                             className={`${fileInfo.avatarUploaded ? 'hidden' : 'inline-block'} mt-2.5`}
//                         >
//                             {fileInfo.uploadingAvatar ? 'Uploading' : 'Upload'}
//                         </Button>
//                         }
//                     </div>
//                     {errors.avatar && (
//                         <p className="text-red-600 mt-4 text-center font-medium">
//                             {errors.avatar.message}
//                         </p>
//                     )}
//                     <div>
//                         <Input
//                             label="Cover Image:"
//                             type="file"
//                             className="mb-4"
//                             accept="image/png, image.jpg, image/jpeg, image/gif"
//                             {...register('coverImage')}
//                         />
//                         { coverFile?.length > 0 &&
//                         <Button 
//                             type='button'
//                             variant='primary'
//                             disabled={fileInfo.uploadingCover}
//                             onClick={uploadCoverImage}
//                             className={`${fileInfo.coverUploaded ? 'hidden' : 'inline-block'} mt-2.5`}
//                         >
//                             {fileInfo.uploadingCover ? 'Uploading' : 'Upload'}
//                         </Button> 
//                         }
//                     </div>
//                     {errors.coverImage && (
//                         <p className="text-red-600 mt-4 text-center font-medium">
//                             {errors.coverImage.message}
//                         </p>
//                     )}
//                     <Button type="submit" className="w-full">
//                         Create Account
//                     </Button>
//                 </form>
//                 <AlertPopup
//                     show={alert.show}
//                     type={alert.type}
//                     message={alert.message}
//                     onClose={closeAlert}
//                 />
//                 { (fileInfo.loading) && (
//                     <Loader />
//                 )}
//             </div>
//         </div>
//     )
// }

// export default SignUp
