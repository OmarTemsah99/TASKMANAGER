import { createContext } from "react";
import type { User } from "../types/user";

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (userData: UserWithToken) => void;
  clearUser: () => void;
}

interface UserWithToken extends User {
  token: string;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
