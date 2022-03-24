import type {NextPage} from 'next'
import axios from "axios";
import dynamic from "next/dynamic";
import {Swiper, SwiperSlide, useSwiper} from "swiper/react";
import SwiperCore, {EffectFade, Navigation, Pagination} from "swiper";
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import styles from "../styles/index.module.scss"
import {useEffect, useLayoutEffect, useState} from "react";
import React from 'react';


SwiperCore.use([Navigation, Pagination, EffectFade])

const ShortPlayerNoSSR = dynamic(() => import('./player'), {ssr: false})


interface SlideItem {
    mck: string;
    start: number;
    end: number;
}

const Home: NextPage = () => {

    const keys = ['FgyNmKJN', 'h6UomKJN', 'SXj7mKJN', 'mhK9mKJN']
    const [newSlideKey, setNewSlideKey] = useState({mck: 'mhK9mKJN', start: 10, end: 20} as SlideItem)
    const [playerSlides, setPlayerSlides] = useState([])


    useEffect(() => {

        let isMounted = true;
        const makeSlide = async (item: SlideItem) => {
            if (item !== undefined && item !== null) {
                const {data} = await axios.get(`http://localhost:3000/api?cuid=test&mck=${item.mck}&start=${item.start}&end=${item.end}`)
                const url = await data.value
                const newSlide = (
                    <SwiperSlide key={`sp_${(new Date()).getTime()}_${Math.floor(Math.random() * 100)}`}>
                        <ShortPlayerNoSSR src={data.value}/>
                    </SwiperSlide>
                )
                // @ts-ignore
                setPlayerSlides([...playerSlides, newSlide])
            }

        }

        makeSlide(newSlideKey).catch(console.error)
        return () => {
            isMounted = false
        }
    }, [newSlideKey]);

    useEffect(() => {
        console.log(playerSlides.length)
        setTimeout(() => {
            if (playerSlides.length <= 0) {
                addNewSlideKey()
            }
        }, 200);
    }, [playerSlides]);

    const addNewSlideKey = () => {
        const min = Math.ceil(0)
        const max = Math.floor(keys.length)
        const index = Math.floor(Math.random() * (max - min)) + min;
        const start = Math.floor(Math.random() * 300)
        const item: SlideItem = {
            mck: keys[index],
            start: start,
            end: start + 10
        }
        // @ts-ignore
        setNewSlideKey(item)
    }

    const slideNextTransitionStart = (swiper: any) => {
        if (swiper.activeIndex == swiper.slides.length - 1) {
            addNewSlideKey()
        }
    };

    const slidePrevTransitionStart = (swiper: any) => {
    };

    return (
        <React.StrictMode>
            <Swiper
                className={styles.swiper}
                // direction={"vertical"}
                effect={"slide"}
                slidesPerView={1}
                mousewheel={true}
                scrollbar={{draggable: true}}
                pagination={{clickable: true}}
                navigation
                onSlideNextTransitionStart={slideNextTransitionStart}
                onSlidePrevTransitionStart={slidePrevTransitionStart}
            >
                {playerSlides}
            </Swiper>
        </React.StrictMode>

    )
}


export default Home
