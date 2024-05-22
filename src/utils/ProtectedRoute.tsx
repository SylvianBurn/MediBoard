import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { logoutRequest } from "./api";

export enum Role {
  "admin",
  "doctor",
  "staff",
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role | undefined;
  authenticateUser: (token: string, localRole: Role) => void;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<undefined | Role>(undefined);

  // acts like a sort of await so the Auth check are finished before allowing the other components to render
  const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);

  // Check for a valid token in local storage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const localRole = localStorage.getItem("role");
    if (storedToken && localRole) {
      console.log("got role form localsotrage:", localRole);
      authenticateUser(storedToken, Role.admin);
    }
    setIsInitialCheckComplete(true);
  }, []);

  const authenticateUser = (token: string, localRole: Role) => {
    const isValidToken = validateToken(token);
    console.log("isValidToken:", isValidToken);
    if (isValidToken) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    }
    localStorage.setItem("role", localRole.toString());
    setRole(localRole);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    logoutRequest().then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, authenticateUser, signOut }}
    >
      {isInitialCheckComplete && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const validateToken = (token: string | null | undefined): boolean => {
  return token !== null && token !== undefined && token !== "";
};
