import { useEffect, useMemo, useState } from "react";

export function useTelegram() {
  const [state] = useState(() => {
    const app = window.Telegram?.WebApp || null;

    return {
      app,
      initData: app?.initData || "",
      platform: app?.platform || "unknown",
      user: app?.initDataUnsafe?.user || null,
      isAvailable: Boolean(app),
      isReady: true,
    };
  });

  useEffect(() => {
    const app = state.app;
    if (!app) {
      return;
    }

    app.ready();
    app.expand();

    applyTelegramTheme(app.themeParams);

    const handleThemeChanged = () => {
      applyTelegramTheme(app.themeParams);
    };

    app.onEvent?.("themeChanged", handleThemeChanged);

    return () => {
      app.offEvent?.("themeChanged", handleThemeChanged);
    };
  }, [state.app]);

  return useMemo(() => state, [state]);
}

function applyTelegramTheme(themeParams = {}) {
  const root = document.documentElement;

  root.style.setProperty("--tg-bg-color", themeParams.bg_color || "#050807");
  root.style.setProperty("--tg-text-color", themeParams.text_color || "#e7fff1");
  root.style.setProperty("--tg-button-color", themeParams.button_color || "#2bff77");
  root.style.setProperty(
    "--tg-button-text-color",
    themeParams.button_text_color || "#03130b"
  );
}
