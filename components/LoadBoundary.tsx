import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; page?: boolean };

export default class LoadBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const retry = new URL(window.location.href);
    retry.searchParams.delete("v");
    retry.searchParams.set("reload", Date.now().toString());

    return (
      <section className="store-load-error section-wrap" aria-labelledby="load-error-title">
        <p className="store-kicker">Skardu Organic</p>
        <h1 id="load-error-title">{this.props.page ? "This page couldn’t load." : "The store couldn’t open."}</h1>
        <p>Please reload to try again. Your saved bag will stay on this device.</p>
        <div>
          <a className="button" href={retry.href}>Reload store</a>
          {this.props.page && <a className="store-link" href="#/">Back to home</a>}
        </div>
      </section>
    );
  }
}
