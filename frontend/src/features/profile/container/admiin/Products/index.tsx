import { Route, Routes } from 'react-router'
import ProductForm from './ProductForm'
import ProductList from './ProductList'

const index = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/create" element={<ProductForm />} />
            <Route path="/:id" element={<ProductForm />} />
        </Routes>
    )
}

export default index
