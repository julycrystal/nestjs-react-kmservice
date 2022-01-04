import CheckoutStepItem from './CheckoutStepItem'

interface ICheckOutTopSectionProps {
    step: number;
}

const CheckOutTopSection = ({ step }: ICheckOutTopSectionProps) => {
    return (
        <>
            <div className="flex justify-between items-center lg:w-3/5 w-4/5 mx-auto text-sm space-x-3">
                <div className="flex flex-col items-center space-y-2">
                    <CheckoutStepItem text="1" isActive={step === 1} />
                </div>
                <div className="w-full border-black border-t-2" />
                <div className="flex flex-col items-center space-y-2">
                    <CheckoutStepItem text="2" isActive={step === 2} />
                </div>
                <div className="w-full border-black border-t-2 my-auto" />
                <div className="flex flex-col items-center space-y-2">
                    <CheckoutStepItem text="3" isActive={step === 3} />
                </div>
            </div>
            <div className="flex justify-between items-center lg:w-4/6 w-5/6 mx-auto text-sm mt-4">
                <p className={step === 1 ? "text-black" : `text-gray-500`}>
                    Address Info
                </p>
                <p className={step === 2 ? "text-black" : `text-gray-500`}>
                    Payment Info
                </p>
                <p className={step === 3 ? "text-black" : `text-gray-500`}>
                    Confirmation
                </p>
            </div>
        </>
    )
}

export default CheckOutTopSection
