import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { 
    AlertPopup, 
    Input, 
    Button, 
    Card, 
    CardHeader, 
    CardContent, 
    CardFooter, 
    CardTitle, 
    Confirm 
} from '../components'
import { useSelector, useDispatch } from "react-redux"
import { update } from "../store"

const ProfileDetails = ({ onUpdateProfile, onChangePassword }) => {
    const userData = useSelector(state => state.auth.userData);
    const [editMode, setEditMode] = useState(false)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [errorPass, setErrorPass] = useState('');
    const [errorProfile, setErrorProfile] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch = useDispatch();
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

    const showAlert = (type, message) => setAlert({show: true, type, message})
    const closeAlert = () => setAlert({...alert, show: false})

    const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileError }, reset: resetProfile } = useForm({
        defaultValues: {
            username: userData.username,
            fullName: userData.fullName,
            email: userData.email,
        },
    })

    useEffect(() => {
        resetProfile({
            username: userData.username,
            fullName: userData.fullName,
            email: userData.email,
        });
    }, [userData, resetProfile]);

    const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordError } } = useForm()

    const submitProfile = async (data) => {
        setErrorProfile('');
        try {
            const response = await onUpdateProfile(data);
            dispatch(update(response.data));
            showAlert('success', response.message);
            setEditMode(false);
        } catch (err) {
            setErrorProfile(err.response?.data?.message || "Something went wrong")
        }
    }

    const submitPassword = async (data) => {
        setErrorPass('');
        try {
            if (data.newPassword !== data.confirmPassword) {
                setErrorPass('Confirm password should match new password');
                return;
            }
            const message = await onChangePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            resetPassword();
            setShowPasswordForm(false);
            showAlert('success', message);
        } catch (err) {
            setErrorPass(err.response?.data?.message || "Something went wrong")
        } finally {
            setShowConfirm(false);
        }
    }

    return (
        <div className={`flex ${showPasswordForm ? 'flex-col-reverse' : 'flex-col'} gap-8 max-w-2xl sm:max-w-7xl mx-auto p-4`}>

            {/* Profile Details Card */}
            <Card className="bg-white shadow-md rounded-xl">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Profile Details</CardTitle>
                    {!editMode && (
                        <Button
                            type="button"
                            variant="primary"
                            className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                            onClick={() => { setEditMode(true); setShowPasswordForm(false); }}
                        >
                            Edit
                        </Button>
                    )}
                </CardHeader>

                <CardContent>
                    {errorProfile && <p className="text-red-600 text-center font-medium">{errorProfile}</p>}
                    <form onSubmit={handleProfileSubmit(submitProfile)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label='Username'
                                placeholder='Enter your username'
                                type='text'
                                disabled={!editMode}
                                {...registerProfile("username", { required: 'Username is required.' })}
                            />
                            {profileError.username && <p className="text-red-600 text-sm">{profileError.username.message}</p>}

                            <Input
                                label='Full Name'
                                placeholder='Enter your full name'
                                type='text'
                                disabled={!editMode}
                                {...registerProfile("fullName", { required: 'Full Name is required' })}
                            />
                            {profileError.fullName && <p className="text-red-600 text-sm">{profileError.fullName.message}</p>}

                            <div className="md:col-span-2">
                                <Input
                                    label='Email'
                                    placeholder='Enter your email'
                                    type='email'
                                    disabled={!editMode}
                                    {...registerProfile("email", {
                                        required: 'Email is required',
                                        validate: {
                                            matchPattern: value =>
                                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                'Email address must be valid',
                                        }
                                    })}
                                />
                                {profileError.email && <p className="text-red-600 text-sm">{profileError.email.message}</p>}
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-2 mt-4">
                                <Button type="submit" variant="primary" className="bg-green-600 hover:bg-green-700 cursor-pointer">Save Changes</Button>
                                <Button type="button" variant="secondary" onClick={() => { resetProfile(); setEditMode(false); }}>Cancel</Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="bg-white shadow-md rounded-xl">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Change Password</CardTitle>
                    {!showPasswordForm && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => { setShowPasswordForm(true); setEditMode(false); resetPassword(); resetProfile(); }}
                            className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                        >
                            Change
                        </Button>
                    )}
                </CardHeader>

                <CardContent>
                    {errorPass && <p className="text-red-600 text-center font-medium">{errorPass}</p>}
                    {showPasswordForm && (
                        <form className="space-y-4">
                            <Input
                                label='Current Password'
                                placeholder='Enter current password'
                                type='password'
                                {...registerPassword("currentPassword", { required: 'Current password is required.' })}
                            />
                            {passwordError.currentPassword && <p className="text-red-600 text-sm">{passwordError.currentPassword.message}</p>}

                            <Input
                                label='New Password'
                                placeholder='Enter new password'
                                type='password'
                                {...registerPassword("newPassword", { required: 'New password is required.' })}
                            />
                            {passwordError.newPassword && <p className="text-red-600 text-sm">{passwordError.newPassword.message}</p>}

                            <Input
                                label='Confirm New Password'
                                placeholder='Confirm new password'
                                type='password'
                                {...registerPassword("confirmPassword")}
                            />
                            {passwordError.confirmPassword && <p className="text-red-600 text-sm">{passwordError.confirmPassword.message}</p>}

                            <div className="flex gap-2 mt-2">
                                <Button type="button" variant="secondary" className="bg-green-600 hover:bg-green-700 cursor-pointer" onClick={() => {setShowConfirm(true)}} >
                                    Update Password
                                </Button>
                                <Button type="button" variant="secondary" onClick={() => { resetPassword(); setShowPasswordForm(false); }}>Cancel</Button>
                            </div>
                        </form>
                    )}
                </CardContent>

                <CardFooter>
                    <AlertPopup show={alert.show} type={alert.type} message={alert.message} onClose={closeAlert} />
                </CardFooter>
            </Card>
            {showConfirm && (
                <Confirm
                    headingText="Do you want to changePassword?"
                    handleConfirm={handlePasswordSubmit(submitPassword)}
                    onCancel={() => setShowConfirm(false)}
                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                />
            )}
        </div>
    )
}

export default ProfileDetails
