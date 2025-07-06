import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

function parseJwt(token: string | null): any {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const payload = parseJwt(token);
      setUserId(
        payload && (payload.id || payload._id)
          ? payload.id || payload._id
          : null
      );
    } else {
      localStorage.removeItem("token");
      setUserId(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
