import { GetProducts_getProducts_data_products } from "../../../__generated__/GetProducts";
import ProductItem from "../../products/components/ProductItem";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper";
// install Swiper modules
SwiperCore.use([Pagination]);

interface IProductSlideSectionProps {
    products: GetProducts_getProducts_data_products[],
    title: string;
}

const ProductSlideSection = ({ products, title }: IProductSlideSectionProps) => {

    return (
        <div>
            <p className="px-2 my-2 font-bold text-xl">{title}</p>
            <div>
                <Swiper
                    slidesPerView={5}
                    spaceBetween={30}
                    navigation={true}
                    pagination={{
                        clickable: true,
                    }}
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
