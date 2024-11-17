import {Navigate} from "react-router-dom"

const AdminProtectedRoute = ({element, userSessionData}) => {
    if (!userSessionData) {
        return <Navigate to="/login" />
    }

    if (!userSessionData['roles'].includes('ROLE_ADMIN')) {
        return <Navigate to="/login" />
    }

    return element
}

export default AdminProtectedRoute;