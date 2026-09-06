import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import heroPoster from "@/assets/hero-poster.jpg";
import BookingLink from "@/components/BookingLink";

const HERO_VIDEO_SRC = "/hero.mp4";

/** Horizontal focus in the 16:9 frame (0–100). Used when mobile crops the sides. */
const MOBILE_FOCUS_X: ReadonlyArray<readonly [number, number]> = [
  [0, 63],
  [1, 68],
  [2.5, 74],
  [4, 80],
  [5.5, 52],
  [6.5, 42],
  [7.1, 50],
  [7.5, 70],
  [8, 55],
  [9, 85],
  [11, 84],
  [13, 20],
  [15, 42],
  [17, 78],
  [20, 62],
];

const focusXAt = (time: number) => {
  const keys = MOBILE_FOCUS_X;
  if (time <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (time <= keys[i][0]) {
      const [t0, x0] = keys[i - 1];
      const [t1, x1] = keys[i];
      const u = (time - t0) / (t1 - t0);
      return x0 + (x1 - x0) * u;
    }
  }
  return keys[keys.length - 1][1];
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Hero = () => {
  const [playVideo, setPlayVideo] = useState(() => !prefersReducedMotion());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPlayVideo(!motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!playVideo || !video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = true;

    const tryPlay = () => {
      if (document.hidden) return;
      video.muted = true;
      const playAttempt = video.play();
      if (playAttempt) playAttempt.catch(() => {});
    };

    const restart = () => {
      try {
        video.currentTime = 0;
      } catch {
        // Some mobile browsers throw if seek happens during an invalid state.
      }
      tryPlay();
    };

    const onEnded = () => restart();
    const onPause = () => {
      // Browsers pause background videos; keep playing whenever the page is visible.
      if (document.hidden) return;
      if (video.ended || (video.duration > 0 && video.currentTime >= video.duration - 0.25)) {
        restart();
        return;
      }
      tryPlay();
    };
    const onTimeUpdate = () => {
      // iOS Safari often never fires `ended` / ignores `loop`.
      if (video.duration > 0 && video.currentTime >= video.duration - 0.12) {
        restart();
      }
    };
    const onVisible = () => {
      if (document.hidden) return;
      tryPlay();
      window.setTimeout(tryPlay, 200);
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    window.addEventListener("pageshow", onVisible);
    tryPlay();

    const watchdog = window.setInterval(() => {
      if (!document.hidden && video.paused) tryPlay();
    }, 800);

    let frame = 0;
    const tick = () => {
      video.style.objectPosition = `${focusXAt(video.currentTime)}% 50%`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(watchdog);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.removeEventListener("pageshow", onVisible);
    };
  }, [playVideo]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image (poster/fallback) + optional video, overlay on top */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {!playVideo ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroPoster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPoster}
            disablePictureInPicture
            disableRemotePlayback
            onError={() => setPlayVideo(false)}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/70 via-[#111827]/50 to-[#111827]/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 max-w-full px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-5 max-w-full px-1 text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 break-words sm:mb-6 sm:px-0 sm:text-5xl md:text-7xl">
            Tillbaka till tävling
            <br />- mer redo än någonsin
          </h1>
          <p className="mb-8 max-w-full px-1 text-base leading-snug text-primary-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 break-words sm:mb-10 sm:px-0 sm:text-xl md:text-2xl">
            Idrottsfysioterapi i
            <br className="sm:hidden" /> Stockholm
          </p>
          
          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="sm" 
              variant="secondary"
              className="min-h-11 w-auto border border-white px-4 py-2 text-sm shadow-[var(--shadow-button)] transition-shadow hover:shadow-[var(--shadow-hover)] sm:px-7 sm:py-5 sm:text-base"
            >
              <BookingLink aria-label="Gå till bokningssidan">
                <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Boka tid
              </BookingLink>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
