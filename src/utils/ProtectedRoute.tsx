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
  // role: Role | undefined;
  role: string | undefined;
  authenticateUser: (token: string, localRole: string) => void;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const convertRole = (role: string): Role => {
  switch (role) {
    case "admin":
      return Role.admin;
    case "doctor":
      return Role.doctor;
    default:
      return Role.staff;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<undefined | string>(undefined);

  // acts like a sort of await so the Auth check are finished before allowing the other components to render
  const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);

  // Check for a valid token in local storage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const localRole = localStorage.getItem("role");
    if (storedToken && localRole) {
      console.log("got role form localstorage:", localRole);
      authenticateUser(storedToken, localRole);
    }
    setIsInitialCheckComplete(true);
  }, []);

  const authenticateUser = (token: string, localRole: string) => {
    const isValidToken = validateToken(token);
    console.log("isValidToken:", isValidToken);
    if (isValidToken) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    }
    localStorage.setItem("role", localRole);
    setRole(localRole);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    logoutRequest().finally(() => {
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

const isAdonisOpaqueToken = (token: string): boolean => {
  const oatRegex = /^oat_.+$/;

  return oatRegex.test(token);
};

const validateToken = (token: string | null | undefined): boolean => {
  return (
    token !== null &&
    token !== undefined &&
    token !== "" &&
    isAdonisOpaqueToken(token)
  );
};
