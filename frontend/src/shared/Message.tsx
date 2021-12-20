interface IMessage {
    onClick: () => void;
    message: string;
    variant: "red" | "green";
}

export default function Message ({ onClick, message, variant }: IMessage) {
    return (
        <div className={`flex w-full font-bold bg-${variant}-500 pl-2 px-4 justify-between items-center py-3 text-${variant}-100`}>
            <p className="">{message}</p>
            <small className="cursor-pointer" onClick={onClick}>x</small>
        </div>
    )
}
