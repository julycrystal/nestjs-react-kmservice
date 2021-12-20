import { Spinner } from '.'

export default function LoadingCmp () {
    return (
        <div className="h-full flex items-center justify-center">
            <Spinner height={40} color={"#000"} />
        </div>
    )
}
