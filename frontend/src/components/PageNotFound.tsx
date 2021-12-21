import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (<div className="items-center justify-center">
        <div className="bg-white shadow-lg mt-16 w-1/2 mx-auto">
            <div className="flex p-10 items-center justify-center space-x-12">
                <div>
                    <FontAwesomeIcon icon={faFrown} size="6x" />
                </div>
                <div className="space-y-3">
                    <p className="text-6xl font-bold">404</p>
                    <p className="uppercase text-lg">OOPS!page not be found</p>
                    <p className="capitalize font-semibold text-justify text-gray-500 mb-6">
                        sorry but the page you are looking for doesn't exists,<br />
                        have been moved, name changed or is temporarily<br />
                        unavailable.
                    </p>
                    <div className="w-1/2 bg-black text-white px-4 py-2 uppercase mt-4">
                        <Link replace to="/">Back to homepage</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default PageNotFound;