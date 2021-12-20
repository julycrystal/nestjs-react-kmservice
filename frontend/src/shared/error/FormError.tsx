export interface IFormError {
    message: string | null;
    onClick: () => void;
}
export interface IErrorMessage {
    message: string | null;
    classes?: string;
}

export default function FormError ({ message, onClick }: IFormError) {
    return (
        <div className="flex w-full font-bold bg-red-500 pl-2 px-4 justify-between items-center py-3 text-white">
            <small className="text-xs ">{message}</small>
            <small className="cursor-pointer" onClick={onClick}>x</small>
        </div>
    )
}

export const ErrorMessage = ({ message, classes }: IErrorMessage) => (<small className={`mb-3 ml-2 text-xs text-red-500 ${classes && classes}`}>{message}</small>)
