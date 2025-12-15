import {
  Card, 
  CardContent, 
  CardTitle,
  CardFooter,
  Button,
  Loader,
  Confirm
} from '@/components'
import { CheckCircle, Clock, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { videoService } from "@/backend";
import { useDispatch, useSelector } from 'react-redux';
import { 
  addToAllVideos, 
  removeFromAllVideos, 
  removeVideo, 
  updateVideo, 
  removeFromWatchHistory, 
  removeFromLikedVideos
} from '@/store';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from "@/utils/time";

const VideoCard = ({ video, owner, showEdits, showAlert, liked, watchHistory, crud }) => {
  const [isPublished, setIsPublished] = useState(video.isPublished);
  const [menuOpen, setMenuOpen] = useState(false); // For triple dot menu
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePublish = async () => {
    try {
      const data = await videoService.togglePublishStatus(video.id);
      if (owner.username === userData.username) dispatch(updateVideo({id: video.id , isPublished: data}));
      if (data) {
        dispatch(addToAllVideos(video))
      } else {
        dispatch(removeFromAllVideos(video.id))
      }
      setIsPublished(data);
      showAlert('success', `Video ${data ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      showAlert('error', error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  const handleDeleteVideo = async () => {
    setLoading(true);
    try {
      const message = await videoService.deleteVideo(video.id);
      setLoading(false);
      showAlert('success', message || 'video deleted successfully');
      dispatch(removeFromAllVideos(video.id));
      dispatch(removeVideo(video.id))
    } catch (error) {
      showAlert('error', error.response?.data?.message || error.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleUpdateVideo = () => {
    navigate(`/update/${video.id}`);
  }

  const handleRemoveFromLikedVideos = async () => {
    setLoading(true);
    try {
      const message = await videoService.removeFromLikedVideos(video.id);
      setLoading(false);
      showAlert('success', message || 'video removed from LikedVideos successfully');
      dispatch(removeFromLikedVideos(video.id))
    } catch (error) {
      showAlert('error', error.response?.data?.message || error.message || 'Something went wrong');
      setLoading(false);
    }
  }

  const handleRemoveFromWatchHistory = async () => {
    setLoading(true);
    try {
      const message = await videoService.removeFromWatchHistory(video.id);
      setLoading(false);
      showAlert('success', message || 'video removed from watch history successfully');
      dispatch(removeFromWatchHistory(video.id))
    } catch (error) {
      showAlert('error', error.response?.data?.message || error.message || 'Something went wrong');
      setLoading(false);
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
    <Card className="overflow-hidden gap-0 shadow-md hover:shadow-lg transition-shadow w-full max-w-sm p-0 relative">
      {/* Thumbnail */}
      <div className="relative w-full h-32 bg-gray-200">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover rounded-t-md"
        />

        {/* Status Badge */}
        <span
          className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${
            isPublished ? "bg-green-600" : "bg-red-600"
          } ${ showEdits && crud ? 'inline' : 'hidden'}`}
        >
          {(isPublished) ? "Published" : "Unpublished"}
        </span>

        {/* Triple dot menu */}
        {showEdits && (
          <div className="absolute top-2 right-2" ref={menuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-700 hover:bg-gray-200 rounded-full cursor-pointer"
              onClick={(e) => { 
                e.stopPropagation(); 
                setMenuOpen(!menuOpen); 
              }}
            >
              <MoreVertical size={16} />
            </Button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border 
              border-gray-200 z-50">

                {/* Placeholder buttons for delete/update */}
                {crud && (
                  <>
                    <button
                      className={`flex items-center w-full px-3 py-2 text-sm cursor-pointer gap-2 
                        hover:bg-gray-100 ${
                        isPublished ? 'text-red-600' : 'text-green-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePublish();
                        setMenuOpen(false);
                      }}
                    >
                      {isPublished ? <CheckCircle size={14}/> : <Clock size={14}/>}
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-sm gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={(e) => {
                        e.stopPropagation()
                        setShowConfirm(true)
                      }}>
                      {/* Add delete icon if needed */}
                      Delete
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-sm gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={(e) => {
                      e.stopPropagation()
                      handleUpdateVideo()}
                  }>
                    Update
                    </button>
                  </>
                )}
                {/* Remove from watchHistory */}
                {watchHistory && (
                  <button className="flex items-center w-full px-3 py-2 text-sm gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFromWatchHistory()
                    }}
                  >
                    Remove from watchHistory
                  </button>
                )}
                {/* Remove from likedVideos */}
                {liked && (
                  <button className="flex items-center w-full px-3 py-2 text-sm gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFromLikedVideos()
                    }}
                  >
                    Remove from likedVideos
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Info */}
      <CardContent className="p-1.5 pt-0">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {video.title}
        </CardTitle>

        <div className="flex items-center justify-between mt-0.5 text-sm text-gray-500">
          <div className="flex flex-col">
            <span className="font-medium">{owner.fullName}</span>
            <span className="text-gray-400 text-xs">@{owner.username}</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span>
              {video.views} views • {video.likes} likes
            </span>
            <span className="text-xs text-gray-400">
              {timeAgo(video.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {showConfirm && (
          <Confirm
            headingText="Do you want to delete?"
            handleConfirm={handleDeleteVideo}
            onCancel={() => setShowConfirm(false)}
            stopPropagation={true}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
