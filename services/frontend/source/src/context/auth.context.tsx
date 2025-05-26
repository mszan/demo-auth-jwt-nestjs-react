import { notification } from "antd";
import { jwtDecode } from "jwt-decode";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { AuthService, JwtLoginResDto, UserRole } from "../client/generated";

type JwtTokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  /** subject - user uuid in this case */
  sub: string;
  username: string;
  roles: UserRole[];
  /** issued at */
  iat: number;
  /** expiration time */
  exp: number;
};

export type JwtRefreshPayload = {
  /** subject - user uuid in this case */
  sub: string;
};

export interface AuthContextInterface {
  jwtTokens: JwtTokens | null;
  login: (username: string, password: string) => Promise<JwtLoginResDto>;
  logout: () => void;
  getJwtPayload: () => JwtPayload | null;
  getJwtRefreshPayload: () => JwtRefreshPayload | null;
}

export const authContextDefaults: AuthContextInterface = {
  jwtTokens: null,
  login: async () => ({ accessToken: "", refreshToken: "" }),
  logout: () => null,
  getJwtPayload: () => null,
  getJwtRefreshPayload: () => null,
};

export const AuthContext =
  React.createContext<AuthContextInterface>(authContextDefaults);
export const AuthContextProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const [jwtTokens, setJwtTokens] = useLocalStorage<JwtTokens | null>(
    "jwtTokens",
    null
  );

  const login = async (
    username: string,
    password: string
  ): Promise<JwtLoginResDto> => {
    const res = await AuthService.authControllerLogin({
      username: username,
      password: password,
    }).catch((err) => {
      notification.error({
        message: "Login failed",
        description:
          err.message == "Unauthorized"
            ? "Unauthorized. Please check your username and password."
            : err.message,
      });
      throw err;
    });
    setJwtTokens(res);
    return res;
  };

  const logout = (): void => {
    setJwtTokens(null);
    navigate("/login", { replace: true });
  };

  const getJwtPayload = (): JwtPayload | null => {
    if (!jwtTokens || !jwtTokens.accessToken) {
      console.error("No access token found in local storage");
      return null;
    }

    return jwtDecode(jwtTokens.accessToken);
  };

  const getJwtRefreshPayload = (): JwtRefreshPayload | null => {
    if (!jwtTokens || !jwtTokens.refreshToken) {
      console.error("No refresh token found in local storage");
      return null;
    }

    return jwtDecode(jwtTokens.refreshToken);
  };

  const value = useMemo(
    () => ({
      jwtTokens,
      login,
      logout,
      getJwtPayload,
      getJwtRefreshPayload,
    }),
    [jwtTokens]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
