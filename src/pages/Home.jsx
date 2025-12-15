import { useSelector } from 'react-redux'
import { VideoGrid } from '@/components';

const Home = () => {
    const videos = useSelector((state) => state.video.allVideos);

    return (
        <div className="mt-[64px] w-full rounded-sm">
            <VideoGrid videos={videos && videos.length > 0 ? videos : []} showEdits={false}/>
        </div>
    )
}


export default Home
