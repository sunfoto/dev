import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app-bg">
          <main className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="neon-alert">
              Ứng dụng gặp lỗi khi hiển thị: {this.state.error.message}
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
