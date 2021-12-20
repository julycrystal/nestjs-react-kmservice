export interface ISolidButtonProps {
    onClick: () => void;
    text: string;
    buttonType?: "button" | "submit" | "reset" | undefined;
    classes?: string;
}

export default function SolidButton ({ onClick, text, buttonType = "button", classes }: ISolidButtonProps) {
    return (
        <button type={buttonType} onClick={onClick} className={`${classes} bg-black text-white py-2 `}>
            {text}
        </button>
    )
}
