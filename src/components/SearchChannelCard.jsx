import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, AlertPopup } from "@/components"
import { subscriptionService } from "@/backend"
import { subscribeChannel, unsubscribeChannel } from "@/store"
import { useDispatch } from "react-redux"


const SearchChannelCard = ({ channel }) => {
  const navigate = useNavigate()
  const { id, username, fullName, avatarUrl, subCount } = channel
  const dispatch = useDispatch();

  const [isSubscribed, setIsSubscribed] = useState(channel.isSubscribed);

  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})

  const handleSubscribeClick = async () => {
    try {
      if (isSubscribed) {
        // Unsubscribe flow
        await subscriptionService.unsubscribeChannel(id);
        dispatch(unsubscribeChannel(id));
        setIsSubscribed(false);
      } else {
        // Subscribe flow
        const result = await subscriptionService.subscribeChannel(id);
        dispatch(subscribeChannel(result));
        setIsSubscribed(true);
      }
    } catch (err) {
      showAlert('error', err?.response?.data?.message || err.message || "Subscription action failed");
    }
  }

  return (
    <div className="lg:w-[60%] mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 py-6 
        hover:bg-zinc-100 rounded-xl transition cursor-pointer justify-center"
        onClick={(e) => navigate(`/channel/${id}`)}
    >  
      {/* Avatar */}
      <img
        src={avatarUrl}
        alt={fullName}
        className="w-32 h-32 rounded-full object-cover"
      />

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold"> {fullName} </h3>

        <p className="text-sm text-zinc-500 mt-1">
          @{username} • {subCount.toLocaleString()} subscribers
        </p>
      </div>

      {/* Subscribe */}
        <Button 
            className={`rounded-full px-4 py-1 font-semibold hover:bg-red-500 bg-red-600 
            cursor-pointer ${ isSubscribed ? "bg-gray-200 hover:bg-gray-300 text-gray-700" 
            : "bg-red-600 hover:bg-red-700 text-white" }
            `}
            onClick={(e) => {
                e.stopPropagation()
                handleSubscribeClick();
            }}
        >
            {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>

        <AlertPopup show={alert.show} type={alert.type} message={alert.message} onClose={closeAlert} />
    </div>
  )
}

export default SearchChannelCard
