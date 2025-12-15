import { useRef, useEffect, useState } from "react";
import { Button, Textarea, VideoGrid, Avatar, AlertPopup, CommentCard } from "@/components";
import { ThumbsUp, Share2, MoreVertical, ThumbsUpIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openMiniPlayer, addToLikedVideos, subscribeChannel, unsubscribeChannel, removeFromLikedVideos } from "@/store";
import { useNavigate } from "react-router-dom";
import { videoService, subscriptionService, commentService } from "@/backend";
import { useForm } from "react-hook-form";
import { timeAgo } from "@/utils/time";

const VideoComp = ({ video, relatedVideos, currentTime, comments, setComments }) => {
  const videoRef = useRef(null);
  const isFullscreen = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(video.likes);
  const initialLikeStatus = useSelector(state => {
    const liked = state.userVideo.likedVideos;
    if (!Array.isArray(liked)) return false;
    if (!video?.id) return false;
    return liked.some(v => v.id === video.id);
  });
  const [likeStatus, setLikeStatus] = useState(initialLikeStatus);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm();
  
  const username = video.owner.username;
  const fullName = video.owner.fullName;

  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})

  const subscribedChannels = useSelector((state) => state.channels.channelList || []);
  const isSubscribed = subscribedChannels.some((ch) => ch.id === video.owner.id);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleSubscribeClick = async () => {
    try {
      if (isSubscribed) {
        // Unsubscribe flow
        await subscriptionService.unsubscribeChannel(video.owner.id);
        dispatch(unsubscribeChannel(video.owner.id));
      } else {
        // Subscribe flow
        const result = await subscriptionService.subscribeChannel(video.owner.id);
        dispatch(subscribeChannel(result));
      }
    } catch (err) {
      showAlert('error', err?.response?.data?.message || err.message || "Subscription action failed");
    }
  };

  const handleLike = async () => {
    try {
      await videoService.toggleVideoLike(video.id);

      if (likeStatus) {
        dispatch(removeFromLikedVideos(video.id));
        setLikeCount(prev => prev - 1);
      } else {
        dispatch(addToLikedVideos(video));
        setLikeCount(prev => prev + 1);
      }

      setLikeStatus(prev => !prev);

    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      showAlert("error", message);
    }
  };

  const handleShare = () => {};

  const handleCommentSubmit = async (data) => {
    const content = data.content.trim();
    if (!content) return;
    try {
      const addedComment = await commentService.addComment({videoId: video.id, content});
      setComments((prev) => [addedComment, ...prev]);
      reset();
    } catch (error) {
      showAlert("error", error?.response?.data?.message || "Failed to add comment");
    }
  };
  const handleCommentDelete = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };
  const handleCommentLike = (id, cnt) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === id ? { ...comment, likes: (comment.likes || 0) + cnt } : comment
      )
    );
  }

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Wait until metadata is loaded before seeking
    const handleLoaded = () => {
        if (currentTime) {
        vid.currentTime = currentTime;
        }
        vid.play().catch(() => {});
    };

    vid.addEventListener("loadedmetadata", handleLoaded);

    // Clean up
    return () => vid.removeEventListener("loadedmetadata", handleLoaded);
  }, [video]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;
      if (e.key.toLowerCase() === "f") {
        const vid = videoRef.current;
        if (!vid) return;

        if (!isFullscreen.current) {
          vid.requestFullscreen?.() ||
            vid.webkitRequestFullscreen?.() ||
            vid.mozRequestFullScreen?.();
          isFullscreen.current = true;
        } else {
          document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.() ||
            document.mozCancelFullScreen?.();
          isFullscreen.current = false;
        }
      }

      if (e.key.toLowerCase() === "i") {
        const vid = videoRef.current;
        const currentTime = vid?.currentTime || 0;

        dispatch(
          openMiniPlayer({
            id: video.id,
            url: video?.videoUrl,
            currentTime, 
          })
        );
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [video, dispatch, navigate]);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 p-4">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col overflow-y-auto pr-2">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            src={video?.videoUrl}
            controls
            className="w-full h-full object-cover"
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
          />
        </div>

        {/* Video Info */}
        <div className="mt-3">
          <h1 className="text-xl font-semibold">{video?.title}</h1>
          {/* Video Stats & Actions */}
          <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
            <div>
              <span>{video?.views} views</span> •{" "}
              <span>{new Date(video?.createdAt).toLocaleDateString()}</span> •{" "}
              <span className="text-xs text-gray-400">{timeAgo(video.createdAt)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleLike}>
                {likeStatus ? (
                  <ThumbsUpIcon size={16} className="mr-1 text-blue-500" /> // filled
                ) : (
                  <ThumbsUp size={16} className="mr-1" /> // outline
                )}
                {likeCount || 0}
              </Button>
              {/* Dislike */}
              {/* <Button variant="ghost" size="sm" onClick={handleDislike}>
                <ThumbsDown size={16} />
              </Button> */}
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 size={16} className="mr-1" /> Share
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical size={16} />
              </Button>
            </div>
          </div>
          {/* Video Description */}
          <div className="mt-3 bg-gray-100 rounded-lg p-3 text-sm text-gray-800">
            <p className={`${showFullDescription ? "" : "line-clamp-3"} whitespace-pre-line`}>
              {video?.description || "No description"}
            </p>

            {video?.description?.length > 150 && (
              <button
                onClick={() => setShowFullDescription(prev => !prev)}
                className="mt-1 text-xs font-semibold text-gray-600 hover:underline"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          {/* Channel Info Section */}
          <div className="flex justify-between items-center mt-8">
            <div 
              className="flex items-center gap-3 hover:cursor-pointer"
              onClick={() => navigate(`/channel/${video.owner.id}`)}
            >
              <Avatar
                src={video?.owner?.avatar}
                name={video?.owner?.fullName || video?.owner?.username}
                size="sm"
                className="w-10 h-10 bg-gray-300 text-gray-700 font-semibold"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-gray-900">{fullName}</span>
                <span className="text-gray-500 text-sm">@{username}</span>
              </div>
            </div>
            <Button 
              className={`rounded-full px-4 py-1 font-semibold hover:bg-red-500 bg-red-600 
                cursor-pointer ${ isSubscribed ? "bg-gray-200 hover:bg-gray-300 text-gray-700" 
                : "bg-red-600 hover:bg-red-700 text-white" }
              `}
              onClick={(e) => {
                e.stopPropagation()
                handleSubscribeClick()
              }}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-4" />

        {/* Comments */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Comments</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowComments(prev => !prev)}
              className="text-sm"
            >
              {showComments ? "Hide comments" : "Show comments"}
            </Button>
          </div>

          {showComments && (
            <>
              {/* Comment Form */}
              <form
                onSubmit={handleSubmit(handleCommentSubmit)}
                className="flex flex-col sm:flex-row gap-2 mb-4"
              >
                <Textarea
                  placeholder="Add a comment..."
                  className="flex-1 resize-none"
                  {...register("content", {
                    required: "Comment can't be empty",
                    minLength: {
                      value: 1,
                      message: "Comment can't be empty"
                    }
                  })}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end sm:self-auto cursor-pointer"
                >
                  Comment
                </Button>
              </form>

              {errors.content && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.content.message}
                </p>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments && comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onDelete={handleCommentDelete}
                      onLike={handleCommentLike}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-[360px] w-full overflow-y-auto sticky top-4">
        <h2 className="text-lg font-semibold mb-2">Related Videos</h2>
        <VideoGrid videos={relatedVideos} showEdits={false} />
      </div>
      <AlertPopup
          show={alert.show}
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
      />
    </div>
  );
};

export default VideoComp;
