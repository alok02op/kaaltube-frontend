import React, { useEffect, useState } from "react";
import { ChannelSlider, ChannelProfile, Loader, AlertPopup } from "@/components";
import { subscriptionService } from "@/backend";
import { useSelector } from "react-redux";

const ChannelVideosSection = () => {
  const channels = useSelector(state => state.channels.channelList);
  const [selectedChannel, setSelectedChannel] = useState(channels.length > 0 ? channels[0] : null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})

  useEffect(() => {
    if (!channels || channels.length === 0) {
      setSelectedChannel(null);
      return;
    }
    setSelectedChannel(prev => prev && channels.some(ch => ch.id === prev.id) ? prev : channels[0]);
  }, [channels]);

  useEffect(() => {
    if (!selectedChannel) return;

    setChannelInfo(null);
    setLoading(true)
    
    subscriptionService.getChannelProfile(selectedChannel.id)
      .then((channel) => {
        setChannelInfo(channel);
      })
      .catch((err) => {
        const message = err?.response?.data?.message || err?.message || "Something went wrong";
        showAlert("error", message);
      })
      .finally(() => setLoading(false))
  }, [selectedChannel])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <Loader />
      </div>
    )
  }
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <ChannelSlider
        channels={channels}
        selectedChannelId={selectedChannel?.id}
        onSelectChannel={setSelectedChannel}
      />

      {selectedChannel && (
        <ChannelProfile channel={channelInfo} />
      )}
      <AlertPopup
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
};

export default ChannelVideosSection;
