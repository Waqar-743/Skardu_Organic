import { useEffect, useRef, useState } from "react";

const poster = `${import.meta.env.BASE_URL}images/hero-apricot-almond.webp`;
const movie = `${import.meta.env.BASE_URL}videos/hero-apricot-almond.mp4`;

export default function HeroBackground() {
  const video = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPlaying(false);
      setMotionAllowed(!preference.matches);
    };
    updatePreference();
    if (typeof preference.addEventListener === "function") {
      preference.addEventListener("change", updatePreference);
      return () => preference.removeEventListener("change", updatePreference);
    }
    preference.addListener(updatePreference);
    return () => preference.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!motionAllowed || !element) return;

    let inView = true;
    let disposed = false;
    const updatePlayback = () => {
      if (document.hidden || !inView) {
        element.pause();
        return;
      }
      // Autoplay can be declined by the browser; the poster stays visible.
      void element.play().catch(() => {
        if (!disposed) setPlaying(false);
      });
    };
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    }) : null;
    observer?.observe(element);
    document.addEventListener("visibilitychange", updatePlayback);
    updatePlayback();

    return () => {
      disposed = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      element.pause();
    };
  }, [motionAllowed]);

  return (
    <div className="hero-media-visual" aria-hidden="true">
      <img src={poster} alt="" width="1280" height="720" />
      {motionAllowed && (
        <video
          ref={video}
          className="hero-video"
          data-playing={playing}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onError={() => setPlaying(false)}
        >
          <source src={movie} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
