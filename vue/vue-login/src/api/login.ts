import request from "./request";
import { LoginCredentials, LoginResponse } from "@/types/user";

/**
 * 用户登录
 */
export const login = (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  return request.post("/login", credentials);
};

/**
 * 用户登出
 */
export const logout = (): Promise<void> => {
  return request.post("/logout");
};

/**
 * 刷新token
 */
export const refreshToken = (): Promise<{ token: string }> => {
  return request.post("/refresh-token");
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): Promise<any> => {
  return request.get("/user/info");
};

/**
 * 检查token有效性
 */
export const checkToken = (token: string): Promise<{ valid: boolean }> => {
  return request.post("/check-token", { token });
};
