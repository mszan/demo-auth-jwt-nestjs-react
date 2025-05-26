import { Layout, notification, Spin } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "../client/generated";
import { AuthContext } from "../context/auth.context";

type Props = {
  component: React.ReactNode;
  requiredRoles?: UserRole[];
};

export function RequireAuth({ component, requiredRoles }: Props) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);

  const { jwtTokens, getJwtPayload } = React.useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setIsLoading(true);
    setIsAuthorized(false);
    canUserAccess();
  }, [location.pathname]);

  const canUserAccess = () => {
    // if there's no required roles for the page, simply let user access the page
    if (!requiredRoles) {
      setIsLoading(false);
      setIsAuthorized(true);
      return true;
    }

    // check whether user is logged in and navigate to login page if not
    if (!jwtTokens) {
      notification.error({
        message: "Not logged in",
        description:
          "The page you just tried to access requires you to be logged in. Please login to continue.",
        duration: 15,
      });

      setIsLoading(false);
      navigate("/login");
      return false;
    }

    // check whether user has required roles to access auth protected page
    const userHasRequiredRoles = requiredRoles.every((requiredRole) =>
      getJwtPayload()?.roles.includes(requiredRole)
    );
    if (!userHasRequiredRoles) {
      notification.error({
        message: "Not logged in",
        description:
          "The page you just tried to access requires you to have certain roles which you do not have. Please contact the website administrator if you think this is a mistake.",
        duration: 15,
      });

      setIsLoading(false);
      navigate(-1);
      return false;
    }

    setIsLoading(false);
    setIsAuthorized(true);
    return true;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Content>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          isAuthorized && component
        )}
      </Layout.Content>
    </Layout>
  );
}
