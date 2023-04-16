import { Navigate } from 'react-router-dom'

interface Props {
    component: React.ComponentType
    path?: string
}

// function isUserLoggedIn(): boolean {
//     const jwtToken = localStorage.getItem('user_info');
//     return jwtToken !== null;
// }

export const PrivateRoute: React.FC<Props> = ({ component: RouteComponent }) => {


    const userLoggedIn = hasUserToken();

    if (userLoggedIn) {
        return <RouteComponent />
    }

    return <Navigate to="/login" />
}