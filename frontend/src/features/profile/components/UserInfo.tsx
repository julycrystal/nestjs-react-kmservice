import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"
import LoadingCmp from "../../../shared/loader/LoadingCmp"


export default function UserInfo () {
    const { user } = useSelector((state: RootState) => state.auth)
    if (!user) {
        return <LoadingCmp />
    }

    return (
        <div className='flex-col bg-gray-50 justify-center text-center text-gray-500 pb-3'>
            <div className=" mx-auto text-center pt-4 rounded-full mb-2">
                <FontAwesomeIcon className="lg:text-3xl text-xl" icon={faUser} />
            </div>
            <p className="font-bold lg:text-2xl text-xl mb-2">
                {user?.name}
            </p>
            <p className="lg:text-sm text-xs font-bold">
                @{user.username}
            </p>
        </div>

    )
}
