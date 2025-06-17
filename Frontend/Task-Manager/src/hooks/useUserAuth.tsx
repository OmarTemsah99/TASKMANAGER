import { useNavigate } from "react-router-dom";
import { useUserContext } from "./useUserContext";
import { useEffect } from "react";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
};
