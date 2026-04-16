import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  const principal = identity?.getPrincipal().toText();

  return {
    identity,
    principal,
    login,
    logout: clear,
    loginStatus,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  };
}
