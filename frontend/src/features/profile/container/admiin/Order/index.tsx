import React from 'react'
import { Route, Routes } from 'react-router'
import OrderDetails from './OrderDetails'
import Orders from './Orders'

const index = () => {
    return (
        <Routes>
            <Route path="/" element={<Orders />} />
            <Route path="/:id" element={<OrderDetails isAdmin={true} />} />
        </Routes>
    )
}

export default index
