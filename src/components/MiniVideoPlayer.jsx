import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    closeMiniPlayer,
} from '@/store'
import { useNavigate } from "react-router-dom";

const MiniVideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onClose = () => {
        dispatch(closeMiniPlayer());
    }

    useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Wait until metadata is loaded before seeking
    const handleLoaded = () => {
        if (video?.currentTime) {
            vid.currentTime = video.currentTime;
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
            if (e.key.toLowerCase() === "i") {
            navigate(`/${video.id}/${videoRef.current?.currentTime}`);
            dispatch(closeMiniPlayer());
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [video?.id, dispatch, navigate]);
    return (
    <div className="fixed bottom-8 right-8 w-80 h-40 bg-black rounded-lg shadow-lg z-50 overflow-hidden">
        {/* Video */}
        <div className="relative w-full h-full">
            <video
                ref={videoRef}
                src={video.url}
                className="w-full h-full object-cover rounded-lg"
                controls
            />

            {/* Close Button (Top-Right) */}
            <button
                onClick={onClose}
                className="absolute cursor-pointer top-1 right-1 bg-black/60 text-white rounded-full px-2 py-1 text-sm font-bold hover:bg-black/80"
            >
                ✕
            </button>
        </div>
    </div>
    );
};

export default MiniVideoPlayer;
