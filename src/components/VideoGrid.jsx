import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { VideoCard, AlertPopup } from ".";
import { useNavigate } from "react-router-dom";
import { closeMiniPlayer } from "@/store";

const VideoGrid = ({ videos, showEdits, liked = false, watchHistory = false }) => {
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})

  let msg;
  if (liked) msg = 'liked'
  else if (watchHistory) msg = 'watched'
  else msg = 'uploaded'
  if (!videos || videos.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6 text-center text-gray-500">
        No videos {msg} yet.
      </div>
    );
  }

  const handleVideoClick = (videoId) => {
    dispatch(closeMiniPlayer());
    navigate(`/${videoId}/0`);
  };

  return (
    <div className="w-full mx-auto px-4 py-2">
      <AlertPopup
          show={alert.show}
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
      />
      <div
        className="grid gap-6 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        {videos.map((video) => {
          const owner = video.owner || {
            fullName: userData.fullName,
            username: userData.username,
          };

          return (
            <div
              key={video.id}
              className="cursor-pointer justify-self-center w-full max-w-xs"
              onClick={() => handleVideoClick(video.id)}
            >
              <VideoCard 
                video={video} 
                owner={owner}
                crud={owner.username === userData.username}
                showEdits={showEdits} 
                showAlert={showAlert}
                liked={liked}
                watchHistory={watchHistory}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoGrid;
