import { createContext, useContext, useState, type ReactNode } from 'react';
import type { LoginResponse } from '../types/auth';

interface AuthUser {
    username: string;
    role: 'ADMIN' | 'STUDENT';
}

interface AuthContextValue {
    user: AuthUser | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'crs_token';
const USER_KEY = 'crs_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    // Khôi phục phiên đăng nhập đồng bộ từ localStorage ngay trong render đầu tiên
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const savedUser = localStorage.getItem(USER_KEY);
            const savedToken = localStorage.getItem(TOKEN_KEY);
            if (savedUser && savedToken) {
                return JSON.parse(savedUser);
            }
        } catch (err) {
            console.error('Lỗi khi đọc phiên đăng nhập từ localStorage:', err);
        }
        return null;
    });

    const login = (data: LoginResponse) => {
        localStorage.setItem(TOKEN_KEY, data.token);
        const authUser: AuthUser = { username: data.username, role: data.role };
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        setUser(authUser);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
    return ctx;
}
