import React, { FC, useEffect, useRef } from 'react'
import videojs from "video.js";
import { IChat, IMessage } from '../../models/chat';
import 'video.js/dist/video-js.css';
import styles from "./VideoPlayer.module.css"

interface VideoPlayerProps {
    currentVideo: IMessage
}


const VideoPlayer: FC<VideoPlayerProps> = ({ currentVideo }) => {
    const playerRef = useRef(null);
    const videoRef = useRef(null);

    console.log(currentVideo, playerRef, videoRef);


    const options = {
        controls: true,
        sources: [{
            src: currentVideo.message,
            type: currentVideo.type
        }],
        width: 300
    }

    useEffect(() => {
        const player: any = playerRef.current;
        if(!player) {
            const video = videoRef.current;
            if(!video) return;

            playerRef.current = videojs(video, options)
        }

        return () => {
            if(player) {
                player.dispose();
                playerRef.current = null;
            }
        }
    }, [currentVideo, playerRef, videoRef])

  return (
    <div className={styles.videoWrapper} data-vjs-player>
      <video ref={videoRef} className='video-js vjs-big-play-centered' />
    </div>
  )
}

export default VideoPlayer