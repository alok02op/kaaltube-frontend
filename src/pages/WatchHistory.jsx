import { useSelector } from 'react-redux'
import { VideoGrid } from '@/components';

const WatchHistory = () => {
    const videos = useSelector((state) => state.userVideo.watchHistory);
    return (
        <div className="mt-[64px] w-full rounded-sm">
            <VideoGrid 
              videos={videos && videos.length > 0 ? videos : []}
              showEdits={true} 
              watchHistory={true}
            />
        </div>
    )
}

export default WatchHistory