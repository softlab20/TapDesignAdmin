import { ReactNode, createContext, useCallback, useContext, useMemo, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import useLocalStorage from "../../hooks/useLocalStorage";

type AuthProvider_TP = {
    children: ReactNode
}
type AuthContext_TP = {
    user: any
    permissions: string[]
    login: (data: any) => void
    logout: () => void
    hasPermission: (permission: string) => any
}

const AuthContext = createContext<AuthContext_TP>(null as unknown as AuthContext_TP);

export const AuthProvider = ({ children }: AuthProvider_TP) => {
    const [permissions, setPermissions] = useState<string[]>([]);
    const [user, setUser] = useLocalStorage<any>('user', null);

    useEffect(() => {
        if (user && user.role && user.role.length > 0) {
            const userPermissions = user.role[0].permissions.map((permission: any) => permission.name);
            setPermissions(userPermissions);
        }
    }, [user]);

    const login = useCallback(async (data: any) => {
        if (setUser)
            setUser(data);
    }, [setUser]);

    const logout = useCallback(async () => {
        Cookies.remove('tokin');
        if (setUser)
            setUser(null);
        setPermissions([]);
    }, [setUser]);

    const hasPermission = useCallback((permission: string) => {
        return permissions.includes(permission);
    }, [permissions]);

    const value = useMemo(() => ({
        user,
        permissions,
        login,
        logout,
        hasPermission,
    }), [login, logout, user, permissions, hasPermission]);

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
