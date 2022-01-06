import React from 'react'
import { Route, Routes } from 'react-router'
import OrderDetails from '../admiin/Order/OrderDetails'
import MyOrders from './MyOrders'

const index = () => {
    return (
        <Routes>
            <Route path="/" element={<MyOrders />} />
            <Route path="/:id" element={<OrderDetails isAdmin={false} />} />
        </Routes>
    )
}

export default index
