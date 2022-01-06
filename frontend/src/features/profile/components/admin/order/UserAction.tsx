import { faFileDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const UserAction = () => {
    return (
        <div className="ml-4">
            <h1 className="font-bold text-xl">Actions</h1>
            <div className="text-sm mt-3 ml-3 space-x-6 flex">
                <button className="bg-black text-white font-bold px-3 py-1">Cancel Order</button>
                <button className="bg-black text-white font-bold px-3 py-2 space-x-2 flex items-center"> <FontAwesomeIcon icon={faFileDownload} /> <p>Download Invoice</p></button>
            </div>
        </div>
    )
}

export default UserAction
