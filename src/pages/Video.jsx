import { useDispatch, useSelector } from 'react-redux'
import { VideoComp, Loader, AlertPopup } from '@/components';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { commentService, videoService } from '@/backend';
import { addToWatchHistory } from '@/store';

const Video = () => {
    const relatedVideos = useSelector((state) => state.video.allVideos);
    const { videoId, currentTime } = useParams();
    const [loading, setLoading] = useState(true);
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const dispatch = useDispatch();

    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
    const showAlert = (type, message) => setAlert({show: true, type, message})
    const closeAlert = () => setAlert({...alert, show: false})

    useEffect(() => {
        setLoading(true);
        videoService
            .getVideoById(videoId)
            .then((response) => {
                setVideo(response.data);
                dispatch(addToWatchHistory(response.data))
            })
            .catch((error) => {
                showAlert('error', error.response?.data?.message || "Something went wrong")
            })
            .finally(() => setLoading(false));
            
    }, [videoId])
    useEffect(() => {
        setLoading(true);
        commentService
            .getVideoComments(videoId)
            .then((response) => {
                setComments(response);
            })
            .catch((error) => {
                showAlert('error', error.response?.data?.message || "Something went wrong")
            })
            .finally(() => setLoading(false));
    }, [videoId])

    if (loading) return <Loader />
    if (!video) return null;
    return (
        <div className="mt-[64px] w-full rounded-sm">
            <VideoComp video={video} relatedVideos={relatedVideos} currentTime = {currentTime} comments={comments} setComments={setComments}/>
            <AlertPopup show={alert.show} type={alert.type} message={alert.message} onClose={closeAlert} />
        </div>
    )
}
export default Video