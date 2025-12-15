import { ProfileImages, ProfileDetails } from "../components"
import { authService } from "../backend"

const Profile = () => {
  const handleAvatarSubmit = async (avatar, type) => {
    try {
      const response = await authService.updateAvatar(avatar, type);
      return response
    } catch (error) {
      throw error
    }
  }

  const handleCoverSubmit = async (coverImage, type) => {
    try {
      const response = await authService.updateCoverImage(coverImage, type);
      return response
    } catch (error) {
      throw error
    }
  }

  const handleProfileUpdate = async (data) => {
    try {
      const response = await authService.updateProfile(data)
      return response;
    } catch (error) {
      throw error
    }
  }

  const handlePasswordChange = async (data) => {
    try {
      const message = await authService.changePassword(data);
      return message;
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="mt-[64px] w-full rounded-sm">
      {/* Main Content */}
      <div className="w-full mx-auto px-4 space-y-8">
        {/* Profile Images */}
        <ProfileImages
          onAvatarSubmit={handleAvatarSubmit}
          onCoverSubmit={handleCoverSubmit}
        />

        {/* Profile Details */}
        <ProfileDetails
          onUpdateProfile={handleProfileUpdate}
          onChangePassword={handlePasswordChange}
        />
      </div>
    </div>
  )
}

export default Profile