import { IS_TELEGRAM_STRICT } from "./config";
import { useMobileOnly } from "./useMobileOnly";
import { useTelegram } from "./useTelegram";
import { useTelegramAuth } from "./useTelegramAuth";

export default function TelegramGate({ children }) {
  const telegram = useTelegram();
  const mobileGate = useMobileOnly(telegram.platform, telegram.isAvailable);
  const shouldAuthenticate = telegram.isReady && mobileGate.isAllowed && telegram.initData;
  const auth = useTelegramAuth({
    enabled: IS_TELEGRAM_STRICT && shouldAuthenticate,
    initData: telegram.initData,
    platform: telegram.platform,
    user: telegram.user,
  });

  if (!telegram.isReady) {
    return <TelegramStatusScreen title="Đang mở ứng dụng" message="Đang khởi tạo Telegram Mini App..." />;
  }

  if (IS_TELEGRAM_STRICT && !mobileGate.isAllowed) {
    return (
      <TelegramStatusScreen
        title="Chỉ hỗ trợ Telegram Mobile"
        message="Vui lòng mở ứng dụng bằng Telegram trên iOS hoặc Android."
      />
    );
  }

  if (IS_TELEGRAM_STRICT && auth.status === "authenticating") {
    return <TelegramStatusScreen title="Đang đăng nhập" message="Đang xác thực tài khoản Telegram..." />;
  }

  if (IS_TELEGRAM_STRICT && auth.status === "error") {
    return (
      <TelegramStatusScreen
        title="Không thể đăng nhập"
        message="Vui lòng thử lại sau hoặc mở lại ứng dụng trong Telegram Mobile."
      />
    );
  }

  return (
    <>
      {!IS_TELEGRAM_STRICT && <TelegramDevBanner telegram={telegram} mobileGate={mobileGate} auth={auth} />}
      {children}
    </>
  );
}

function TelegramStatusScreen({ title, message }) {
  return (
    <main className="telegram-status-screen">
      <section className="telegram-status-panel">
        <div className="logo-badge telegram-status-logo">NS</div>
        <h1>{title}</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}

function TelegramDevBanner({ telegram, mobileGate }) {
  const status = telegram.isAvailable
    ? `Telegram: ${telegram.platform} | Mobile: ${mobileGate.isAllowed ? "yes" : "no"}`
    : "Dev mode: Telegram SDK chưa có, app đang chạy giả lập.";

  return <div className="telegram-dev-banner">{status}</div>;
}
