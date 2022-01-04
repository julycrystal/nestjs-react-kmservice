import React from 'react'
import { Route, Routes } from 'react-router'
import Checkout from './Checkout'
import CheckoutSuccess from './CheckoutSuccess'

const index = () => {
    return (
        <Routes>
            <Route path="/" element={<Checkout />} />
            <Route path="/success" element={<CheckoutSuccess />} />
        </Routes>
    )
}

export default index
