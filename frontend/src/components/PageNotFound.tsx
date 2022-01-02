import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (<div className="items-center justify-center">
        <div className="bg-white shadow-lg mt-16 lg:w-2/5 mx-6 lg:mx-auto">
            <div className="flex lg:flex-row flex-col lg:p-10 p-6 items-center justify-center lg:space-x-6">
                <div>
                    <FontAwesomeIcon icon={faFrown} className="lg:text-9xl text-6xl" />
                </div>
                <div className="space-y-3 text-center lg:text-left mx-auto">
                    <p className="lg:text-6xl text-3xl font-bold">404</p>
                    <p className="uppercase lg:text-lg">OOPS!page not be found</p>
                    <p className="capitalize font-semibold text-justify text-gray-500 mb-6 text-sm">
                        sorry but the page you are looking for doesn't exists,
                        have been moved, name changed or is temporarily unavailable.
                    </p>
                    <div className="lg:w-2/3 w-full text-center  bg-black text-white px-4 py-2 uppercase mt-4">
                        <Link replace to="/">Back to homepage</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default PageNotFound;