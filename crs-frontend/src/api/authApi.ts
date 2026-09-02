import axiosClient from "./axiosClient";
import type {LoginResponse, LoginRequest} from "../types/auth";

export const login = (payload: LoginRequest) => {
    return axiosClient.post<LoginResponse>('/api/auth/login', payload);
};