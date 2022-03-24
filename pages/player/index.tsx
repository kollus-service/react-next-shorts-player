import React, {memo, useEffect, useRef, useState, useCallback} from 'react';
import classNames from "classnames";
import styles from "../../styles/player.module.scss";
import axios from "axios";
import {set} from "immutable";

interface IProps {
    className?: string;
    src: string;
}

const ShortPlayer: React.FC<IProps> = ({className, src}) => {
    const [videoSrc, setVideoSrc] = useState(src)
    const [nowPlaying, setNowPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControl, setShowControl] = useState(false);
    const [visiblePlayer, setVisiblPlayer] = useState(false);
    const ref = useRef<HTMLVideoElement>(null);
    const totalTime = (ref && ref.current && ref.current.duration) || 0;
    const videoElement = ref && ref.current;
    const classProps = classNames(styles.video, className);
    const startTime = Math.floor(currentTime);
    const containerRef = useRef<HTMLElement>(null)

    const addTimeUpdate = () => {
        const observedVideoElement = ref && ref.current;

        if (observedVideoElement) {
            observedVideoElement.addEventListener("timeupdate", function () {
                setCurrentTime(observedVideoElement.currentTime);
            });

            if (observedVideoElement.readyState == 0) {
                observedVideoElement.load()
            }
            setNowPlaying(true);
            if (!observedVideoElement.attributes.getNamedItem('autoplay')) {
                observedVideoElement.play();
            }
        }

    }
    const watchParent = () => {
        setInterval(() => {
            const self = containerRef && containerRef.current

            if (self !== null) {
                // @ts-ignore
                if (self.parentElement.className.indexOf('swiper-slide-active') >= 0) {
                    setVisiblPlayer(true)
                } else {
                    setVisiblPlayer(false)
                }
            }
        }, 300);

    }


    useEffect(() => {
        let isMounted = true
        addTimeUpdate();
        watchParent();
        return () =>{
            isMounted = false
        }
    }, []);
    //루프동작 강제 로직
    //Chrome 의 경우 영상 응답이 206 (Partial Content) 인경우 loop 동작이 되지 않음
    useEffect(() => {
        const observedVideoElement = ref && ref.current;
        if (nowPlaying && currentTime == 0) {
            observedVideoElement.load();
        }
    }, [currentTime, nowPlaying]);
    useEffect(() => {
        const observedVideoElement = ref && ref.current;
        if (visiblePlayer) {
            observedVideoElement.play()
        } else {
            observedVideoElement.pause()
        }
    }, [visiblePlayer]);
    const onProgressChange = (percent: number) => {
        if (!showControl) {
            setShowControl(true);
        }
        if (videoElement) {
            const playingTime = videoElement.duration * (percent / 100);
            setCurrentTime(playingTime);
        }
    };
    const onPlayIconClick = () => {
        if (videoElement) {
            if (nowPlaying) {
                setNowPlaying(false);
                videoElement.pause();
            } else {
                setNowPlaying(true);
                videoElement.play();
            }
        }
    };
    const handleControlVisible = () => {
        if (!showControl) {
            setShowControl(true);
            setTimeout(() => {
                setShowControl(false)
            }, 2000);
        }
    };


    return (
        <div className={styles.default} ref={containerRef}>
            <style jsx global>{`
              #__next {
                position: absolute;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
            `}</style>
            <video className={classProps}
                   loop={true}
                   muted={true}
                   playsInline={true}
                   autoPlay={true}
                   onClick={handleControlVisible}
                   ref={ref}
            >
                <source src={videoSrc} type="video/mp4"/>
            </video>
        </div>
    )
}

export default memo(ShortPlayer);
