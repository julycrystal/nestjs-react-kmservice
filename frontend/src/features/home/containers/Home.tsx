// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "./Home.css";
// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper";

import NewestProductSection from "../components/NewestProductSection";
import PopularProductSection from "../components/PopularProductSection";
import Header from "../../../shared/Header";

// install Swiper modules
SwiperCore.use([Pagination]);

const Home = () => {

    return (
        <div className="space-y-8 mb-8 bg-gray-100">
            <Header title="Home" description="Buy Everything you need." />
            <div className="lg:h-96 h-60 bg-green-500">
                <Swiper pagination={true} className="text-black">
                    <SwiperSlide>
                        <div className="h-96">Slide 1</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="h-96">Slide 2</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="h-96">Slide 3</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="h-96">Slide 4</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="h-96">Slide 5</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="h-96">Slide 6</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="h-96">Slide 7</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="h-96">Slide 8</div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="h-96">Slide 9</div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="mx-4 space-y-8">
                <NewestProductSection />
                <PopularProductSection />
            </div>
        </div>
    );
};

export default Home;
