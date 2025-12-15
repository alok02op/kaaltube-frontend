import { useSelector } from 'react-redux'
import { VideoGrid } from '@/components';

const Likes = () => {
    const videos = useSelector((state) => state.userVideo.likedVideos); 
    return (
        <div className="mt-[64px] w-full rounded-sm">
            <VideoGrid 
              videos={videos && videos.length > 0 ? videos : []}
              showEdits={true}
              liked={true}
            />
        </div>
    )
}

export default Likes
