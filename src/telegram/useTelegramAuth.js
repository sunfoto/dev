import { useEffect, useMemo, useState } from "react";
import { TELEGRAM_AUTH_ENDPOINT } from "./config";

export function useTelegramAuth({ enabled, initData, platform, user }) {
  const [state, setState] = useState({
    status: enabled ? "authenticating" : "idle",
    user: null,
    error: "",
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    async function authenticate() {
      try {
        const response = await fetch(TELEGRAM_AUTH_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: controller.signal,
          body: JSON.stringify({ initData, platform }),
        });

        if (!response.ok) {
          throw new Error(`Auth failed with status ${response.status}`);
        }

        const data = await response.json();

        setState({
          status: "authenticated",
          user: data.user || user || null,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          status: "error",
          user: null,
          error: error instanceof Error ? error.message : "Auth failed",
        });
      }
    }

    authenticate();

    return () => controller.abort();
  }, [enabled, initData, platform, user]);

  return useMemo(() => state, [state]);
}
