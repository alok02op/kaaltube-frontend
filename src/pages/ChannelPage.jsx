import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, AlertPopup, ChannelProfile } from '@/components';
import { subscriptionService } from '@/backend';

const ChannelPage = () => {
    const { id } = useParams();
    
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
    const showAlert = (type, message) => setAlert({show: true, type, message})
    const closeAlert = () => setAlert({...alert, show: false})
    
    const [loading, setLoading] = useState(false);
    const [channelInfo, setChannelInfo] = useState(null);

    useEffect(() => {
        if (!id) return;
        setChannelInfo(null);
        setLoading(true)
        subscriptionService.getChannelProfile(id)
        .then((channel) => {
            setChannelInfo(channel);
        })
        .catch((err) => {
            const message = err?.response?.data?.message || err?.message || "Something went wrong";
            showAlert("error", message);
        })
        .finally(() => setLoading(false))
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br 
                from-blue-50 via-white to-blue-100">
                <Loader />
            </div>
        )
    }
    return (
        <div className="mt-[64px] w-full rounded-sm">
            <div className="w-full bg-gray-50 min-h-screen">
                <ChannelProfile channel={channelInfo} />
            </div>
            <AlertPopup show={alert.show} type={alert.type} message={alert.message} onClose={closeAlert} />
        </div>
    )
}


export default ChannelPage
