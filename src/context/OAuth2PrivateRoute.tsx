import React from "react";
import { useAuth } from "react-oidc-context"
import { Spin, Typography } from "antd"
const { Title } = Typography

interface OAuth2PrivateRouteProps {
    children: JSX.Element;
}
const OAuth2PrivateRoute = ({ children }: OAuth2PrivateRouteProps) => {

    const auth = useAuth();

    const textAlignStyle: React.CSSProperties = { textAlign: "center" };
    const subTitleStyle: React.CSSProperties = { color: 'grey' };

    if (auth.isLoading) {
        return (
            <div style={textAlignStyle}>
                <Title>Keycloak is loading</Title>
                <Title level={2} style={subTitleStyle}>or running authorization</Title>
                <Spin size={"large"}></Spin>
            </div>
        );
    }

    if (auth.error) {
        return (
            <div style={textAlignStyle}>
                <Title>Oops ...</Title>
                <Title level={2} style={subTitleStyle}>{auth.error.message}</Title>
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        auth.signinRedirect();
        return null;
    }

    return children;
}
export default OAuth2PrivateRoute;