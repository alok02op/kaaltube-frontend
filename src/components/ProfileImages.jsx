import { useForm } from "react-hook-form"
import { useState } from "react"
import { Button, Input, AlertPopup, Loader } from '../components'
import { useSelector, useDispatch } from "react-redux"
import { update } from "../store"
import { cloudService } from "../backend"
import { Loader2, Upload } from "lucide-react";
import defaultCoverImage from "@/assets/defaultCoverImage.avif";

const ProfileImages = ({ onAvatarSubmit, onCoverSubmit }) => {
  const userData = useSelector(state => state.auth.userData);
  const [avatarPreview, setAvatarPreview] = useState(userData.avatar)
  const [coverPreview, setCoverPreview] = useState(userData.coverImage || defaultCoverImage)
  const dispatch = useDispatch();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})

  const {fullName, username, subscriberCount, videosCount} = useSelector(state => state.userChannel.info);

  const { register: registerAvatar, handleSubmit: handleAvatarSubmit, watch: watchAvatar, reset: resetAvatar } = useForm()

  const { register: registerCover, handleSubmit: handleCoverSubmit, watch: watchCover, reset: resetCover } = useForm()

  const avatarFile = watchAvatar("avatar")
  const coverFile = watchCover("coverImage")

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) setAvatarPreview(URL.createObjectURL(file))
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) setCoverPreview(URL.createObjectURL(file))
  } 

  const uploadAvatar = async (file) => {
    if (!file) {
      showAlert('warning', 'Please select an image before uploading');
      return null;
    }
    setUploadingAvatar(true);
    try {
      return await cloudService.uploadOnCloudinary(file, 'image');
    } catch (error) {
      showAlert('error', error?.message || 'Avatar upload failed')
    } finally {
      setUploadingAvatar(false);
    }
  }

  const uploadCoverImage = async (file) => {
    if (!file) {
      showAlert('warning', 'Please select an image before uploading');
      return null;
    }
    setUploadingCover(true);
    try {
      return await cloudService.uploadOnCloudinary(file, 'image');
    } catch (error) {
      showAlert('error', error?.message || 'Cover upload failed')
    } finally {
      setUploadingCover(false);
    }
  }

  const submitAvatar = async (data) => {
    setLoading(true);
    try {
      const avatarId = await uploadAvatar(data?.avatar[0]);
      if (!avatarId) return;
      const response = await onAvatarSubmit(avatarId);
      dispatch(update({avatar: response.data.avatarUrl}))
      resetAvatar()
      showAlert('success', response.message);
    } catch (error) {
      showAlert('error', error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  const submitCover = async (data) => {
    setLoading(true)
    try {
      const coverImageId = await uploadCoverImage(data?.coverImage[0]);
      if (!coverImageId) return;
      const response = await onCoverSubmit(coverImageId);
      dispatch(update({coverImage: response.data.coverImageUrl}))
      resetCover()
      showAlert('success', response.message);
    } catch (error) {
      showAlert('error', error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <form onSubmit={handleCoverSubmit(submitCover)} className="relative w-full">
        <div className="relative h-44 sm:h-56 md:h-64 w-full rounded-2xl overflow-hidden shadow-md">
          <img src={coverPreview || null} alt="Cover" className="w-full h-full object-cover" />
          <label className="absolute z-30 bottom-3 right-3 bg-white/90 hover:bg-white text-sm px-3 py-1 rounded cursor-pointer shadow">
            Change Cover
            <Input
              type='file'
              accept='image/*'
              {...registerCover("coverImage")}
              onChange={(e) => {
                registerCover("coverImage").onChange(e);
                handleCoverChange(e)
              }}
              className="hidden"
            />
          </label>
        </div>

        {coverFile?.length > 0 && (
          <Button
            type="submit"
            variant="primary"
            disabled={uploadingCover}
            className="mt-2 py-1 sm:float-right bg-zinc-800 text-white hover:bg-zinc-900 cursor-pointer"
          >
            {uploadingCover ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" /> Upload
              </>
            )}
          </Button>
        )}
      </form>

      {/* Avatar Image overlapping Cover */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex flex-col sm:flex-row gap-6 -mt-14">
          {/* Avatar */}
          <form onSubmit={handleAvatarSubmit(submitAvatar)}>
            <div className="relative">
              <img
                src={avatarPreview || null}
                alt="Avatar"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gray-200"
              />
              <label className="absolute bottom-0 right-0 bg-white/90 hover:bg-white text-xs px-2 py-1 rounded cursor-pointer shadow">
                Change
                <Input 
                  type='file'
                  accept='image/*'
                  {...registerAvatar("avatar")}
                  className="hidden"
                  onChange={(e) => {
                    registerAvatar("avatar").onChange(e);
                    handleAvatarChange(e)
                  }}
                />
              </label>
            </div>

            {avatarFile?.length > 0 && (
              <Button
                type="submit"
                variant="primary"
                disabled={uploadingAvatar}
                className="mt-1 py-1 w-full bg-zinc-800 text-white hover:bg-zinc-900 cursor-pointer"
              >
                {uploadingAvatar ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" /> Upload
                  </>
                )}
              </Button>
            )}
          </form>

          {/* Channel Info */}
          <div className="flex-1 w-full">
            <div className="bg-gray-100 rounded-lg w-fit sm:p-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {fullName}
              </h1>
              <p className="text-gray-500">@{username}</p>

              {/* Stats */}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  <b className="text-gray-900">{subscriberCount}</b>{" "}
                  subscribers
                </span>
                <span>
                  <b className="text-gray-900">{videosCount}</b>{" "}
                  videos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertPopup show={alert.show} type={alert.type} message={alert.message} onClose={closeAlert} />
      {loading && <Loader />}
    </div>
  )
}

export default ProfileImages