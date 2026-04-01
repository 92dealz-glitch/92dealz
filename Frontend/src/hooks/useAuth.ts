import { useEffect } from "react";
import { useAuthContext } from "../context/AuthProvider";

export function useAuth() {
  const { user, setUser } = useAuthContext();

  useEffect(() => {
    // placeholder: hydrate auth from cookie/localStorage or call an API
    // keep side effects here, not in components
  }, [setUser]);

  return { user, setUser };
}
