import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { VideoGrid, AlertPopup } from "@/components";
import { subscriptionService } from "@/backend";
import { subscribeChannel, unsubscribeChannel } from "@/store";
import defaultCoverImage from "@/assets/defaultCoverImage.avif";

const ChannelProfile = ({ channel }) => {
  const dispatch = useDispatch();
  if (!channel) return (
    <div className="mt-[64px] w-full rounded-sm bg-gray-50 min-h-screen">
      <div className="p-6 text-center text-zinc-500">
        Search with valid id
      </div>
    </div>
  );

  const { id, name, username, avatar, coverImage, subscriberCount, videosCount, isOwner, videos } = channel;
  const [isSubscribed, setIsSubscribed] = useState(channel.isSubscribed);

  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})

  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await subscriptionService.unsubscribeChannel(id);
        dispatch(unsubscribeChannel(id));
        setIsSubscribed(false);
      } else {
        const result = await subscriptionService.subscribeChannel(id);
        dispatch(subscribeChannel(result));
        setIsSubscribed(true);
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      showAlert("error", message);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Cover */}
      <div className="relative w-full h-44 sm:h-56 md:h-64">
        <img
          src={coverImage || defaultCoverImage}
          alt={`${name} cover`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex flex-col sm:flex-row gap-6 -mt-14">
          {/* Avatar */}
          <img
            src={avatar}
            alt={name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gray-200"
          />

          {/* Channel Info */}
          <div className="flex-1 w-full">
            <div className="bg-gray-100 rounded-lg w-fit sm:p-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {name}
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

          {/* Subscribe Button */}
          {!isOwner && (
            <div className="self-start sm:self-center">
              <button
                onClick={handleSubscribe}
                className={`rounded-full px-6 py-2 font-semibold transition shadow-sm
                  ${
                    isSubscribed
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 border-b border-gray-200" />

      {/* Videos */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <VideoGrid videos={videos} showEdits={isOwner} />
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

export default ChannelProfile;
