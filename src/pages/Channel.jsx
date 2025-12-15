import { authService } from "../backend";
import { useState } from "react";
import { VideoUploadForm, VideoGrid, ProfileImages } from "../components";
import { useSelector } from "react-redux";

const Channel = () => {
  const [active, setActive] = useState({
    videos: true,
    post: false,
  });
  const videos = useSelector((state) => state.userVideo.videos);

  const handleAvatarSubmit = async (avatar) => {
    try {
      const response = await authService.updateAvatar(avatar);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleCoverSubmit = async (coverImage) => {
    try {
      const response = await authService.updateCoverImage(coverImage);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="mt-[64px] w-full rounded-sm bg-gray-50 min-h-screen">
      <div className="w-full mx-auto px-4 space-y-2">
        {/* Profile Images */}
        <ProfileImages
          onAvatarSubmit={handleAvatarSubmit}
          onCoverSubmit={handleCoverSubmit}
        />

        {/* Tabs */}
        <div className="max-w-7xl w-full mx-auto flex gap-4 h-8">
          <button
            className={`inline-block font-bold text-gray-500 hover:border-b-2
              py-1 px-4 ${active.videos ? "text-gray-900 border-b-2" : ""} cursor-pointer`}
            onClick={() => setActive({ post: false, videos: true })}
          >
            Videos
          </button>
          <button
            className={`inline-block font-bold text-gray-500 hover:border-b-2
              py-1 px-4 ${active.post ? "text-gray-900 border-b-2" : ""} cursor-pointer`}
            onClick={() => setActive({ post: true, videos: false })}
          >
            Post
          </button>
        </div>

        <hr className="border-t border-gray-300" />

        {/* Content */}
        {active.videos && (
          <VideoGrid videos={videos && videos.length > 0 ? videos : []} showEdits={true}/>
        )}
        {active.post && <VideoUploadForm />}
      </div>
    </div>
  );
};

export default Channel;
