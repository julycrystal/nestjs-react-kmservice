import { Route, Routes } from 'react-router'
import UserDetail from './UserDetail'
import UserList from './UsersList'

const index = () => {
    return (
        <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/:id" element={<UserDetail />} />
        </Routes>
    )
}

export default index
