import { Spinner } from '../loader'
import SolidButton from './SolidButton'

export interface ISubmitButtonProps {
    loading: boolean;
    isValid: boolean;
    buttonText: string;
    classes?: string;
}

export default function SubmitButton ({ loading, isValid, buttonText, classes }: ISubmitButtonProps) {
    return <>
        {
            loading ?
                <button type="submit" className={`bg-black text-white py-2 mb-4 flex justify-center cursor-wait ${classes ? classes : ""}`
                }> <Spinner /> </button > :
                <SolidButton buttonType="submit" classes={`mb-4 ${classes ? classes : ""} ${!isValid && 'cursor-not-allowed bg-gray-600'}`} text={buttonText} onClick={() => { }} />}
    </>
}
