import {Navigate} from "react-router-dom";

const ProtectedRoute = ({element, token}) => {
    return token ? element : <Navigate to='/login' />
}

export default ProtectedRoute