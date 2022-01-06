import { GetProducts_getProducts_data_products } from "../../../__generated__/GetProducts";
import ProductItem from "../../products/components/ProductItem";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper";
import { useMediaQuery } from "react-responsive";
// install Swiper modules
SwiperCore.use([Pagination]);

interface IProductSlideSectionProps {
    products: GetProducts_getProducts_data_products[],
    title: string;
    minItems?: number;
}

const ProductSlideSection = ({ products, title, minItems = 5 }: IProductSlideSectionProps) => {
    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px)'
    });
    return (
        <div>
            <p className="px-2 my-2 font-bold text-xl">{title}</p>
            <div>
                <Swiper
                    slidesPerView={isDesktop ? minItems : 1}
                    spaceBetween={30}
                    navigation={true}
                    className="mySwiper"
                >
                    {products.map((product) => (<SwiperSlide className="w-full">
                        <ProductItem product={product} className="w-full px-2" />
                    </SwiperSlide>))
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default ProductSlideSection
