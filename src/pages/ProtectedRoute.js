import {Navigate} from "react-router-dom";

const ProtectedRoute = ({element, userSessionData}) => {
    return userSessionData ? element : <Navigate to='/login' />
}

export default ProtectedRoute