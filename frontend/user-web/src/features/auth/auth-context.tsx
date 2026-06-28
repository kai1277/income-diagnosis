import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initLiffAndLogin, getLastAuthError, type AuthResult } from "@/lib/auth";

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

const isDebugMode = new URLSearchParams(window.location.search).get("debug") === "1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    userId: null,
    isLoading: true,
  });
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    initLiffAndLogin().then((result: AuthResult | null) => {
      setState({
        accessToken: result?.accessToken ?? null,
        userId: result?.userId ?? null,
        isLoading: false,
      });
      setDebugError(getLastAuthError());
    });
  }, []);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={state}>
      {isDebugMode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: debugError ? "#fee2e2" : state.accessToken ? "#dcfce7" : "#fef9c3",
            padding: "8px 12px",
            fontSize: "11px",
            fontFamily: "monospace",
            wordBreak: "break-all",
            borderBottom: "1px solid #ccc",
          }}
        >
          <strong>[auth debug]</strong>{" "}
          {state.accessToken
            ? `✅ logged in (userId: ${state.userId})`
            : debugError
            ? `❌ ${debugError}`
            : "⚠️ auth skipped (login redirect or LIFF_ID unset)"}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
