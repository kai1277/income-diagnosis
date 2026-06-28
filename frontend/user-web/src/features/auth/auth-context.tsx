import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initLiffAndLogin, type AuthResult } from "@/lib/auth";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({
  accessToken: null,
  userId: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    userId: null,
    isLoading: true,
  });

  useEffect(() => {
    initLiffAndLogin().then((result: AuthResult | null) => {
      setState({
        accessToken: result?.accessToken ?? null,
        userId: result?.userId ?? null,
        isLoading: false,
      });
    });
  }, []);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
