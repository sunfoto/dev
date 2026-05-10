import { useEffect, useMemo, useState } from "react";
import { MOBILE_TELEGRAM_PLATFORMS } from "./config";

export function useMobileOnly(platform, isTelegramAvailable) {
  const [screen, setScreen] = useState(() => getScreenState());

  useEffect(() => {
    const handleResize = () => {
      setScreen(getScreenState());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useMemo(() => {
    const isTelegramMobile = MOBILE_TELEGRAM_PLATFORMS.includes(platform);
    const isAllowed = isTelegramAvailable && isTelegramMobile && screen.hasTouch && screen.isSmall;

    return {
      isAllowed,
      isTelegramMobile,
      hasTouch: screen.hasTouch,
      isSmallScreen: screen.isSmall,
    };
  }, [isTelegramAvailable, platform, screen.hasTouch, screen.isSmall]);
}

function getScreenState() {
  return {
    hasTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    isSmall: window.innerWidth < 900,
  };
}
