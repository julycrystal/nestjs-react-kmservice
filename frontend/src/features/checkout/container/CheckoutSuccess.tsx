import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutSuccess = () => {
    return (
        <div className="h-96 mt-8">
            <div className="flex flex-col space-y-8 items-center justify-center h-full bg-white w-1/3 mx-auto shadow-lg">
                <FontAwesomeIcon icon={faCheckCircle} color="black" className="text-5xl" />
                <p className="font-bold text-2xl">Checkout Success!</p>
                <Link to="/" className="bg-black text-white px-8 py-2">Home</Link>
            </div>
        </div>
    )
}

export default CheckoutSuccess
