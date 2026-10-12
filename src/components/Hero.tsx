import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import heroPoster from "@/assets/hero-poster.jpg";
import BookingLink from "@/components/BookingLink";

const HERO_VIDEO_DESKTOP_SRC = "/hero.mp4";
const HERO_VIDEO_MOBILE_SRC = "/hero-mobile.mp4";
const DESKTOP_HERO_QUERY = "(min-width: 768px)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const prefersDesktopHero = () =>
  typeof window !== "undefined" && window.matchMedia(DESKTOP_HERO_QUERY).matches;

const Hero = () => {
  const [playVideo, setPlayVideo] = useState(() => !prefersReducedMotion());
  const [desktopHero, setDesktopHero] = useState(prefersDesktopHero);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const heroVideoSrc = desktopHero ? HERO_VIDEO_DESKTOP_SRC : HERO_VIDEO_MOBILE_SRC;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPlayVideo(!motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_HERO_QUERY);
    const sync = () => setDesktopHero(desktopQuery.matches);
    sync();
    desktopQuery.addEventListener("change", sync);
    return () => desktopQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    startedRef.current = false;
    setVideoReady(false);

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
    const onPlaying = () => {
      startedRef.current = true;
      setVideoReady(true);
    };
    const onPause = () => {
      if (document.hidden || !startedRef.current) return;
      if (video.ended || (video.duration > 0 && video.currentTime >= video.duration - 0.25)) {
        restart();
        return;
      }
      tryPlay();
    };
    const onTimeUpdate = () => {
      if (!startedRef.current) return;
      // iOS Safari often never fires `ended` / ignores `loop`.
      if (video.duration > 0 && video.currentTime >= video.duration - 0.12) {
        restart();
      }
    };
    const onVisible = () => {
      if (document.hidden) return;
      tryPlay();
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);
    tryPlay();

    const watchdog = window.setInterval(() => {
      if (document.hidden || !video.paused) return;
      if (!startedRef.current && video.readyState < 2) return;
      tryPlay();
    }, 1500);

    return () => {
      window.clearInterval(watchdog);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
    };
  }, [playVideo, heroVideoSrc]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image (poster/fallback) + optional video, overlay on top */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroPoster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {playVideo ? (
          <video
            key={heroVideoSrc}
            ref={videoRef}
            className={[
              "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300",
              videoReady ? "opacity-100" : "opacity-0",
            ].join(" ")}
            src={heroVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPoster}
            disablePictureInPicture
            disableRemotePlayback
            onError={() => setPlayVideo(false)}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/70 via-[#111827]/50 to-[#111827]/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 w-full min-w-0 max-w-full px-5 md:px-4 py-14 sm:py-20">
        <div className="mx-auto w-full min-w-0 max-w-4xl text-center">
          <h1 className="mb-5 w-full max-w-full text-[clamp(1.75rem,9vw,3rem)] font-bold leading-[1.15] tracking-tighter text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 sm:mb-6 sm:text-5xl sm:leading-tight sm:tracking-tight md:text-7xl">
            <span className="block max-sm:whitespace-nowrap">Tillbaka till tävling</span>
            <span className="block max-sm:whitespace-nowrap">– mer redo än någonsin</span>
          </h1>
          <p className="mb-8 w-full max-w-full px-1 text-xl leading-snug text-primary-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 break-words sm:mb-10 sm:px-0 sm:text-xl md:text-2xl">
            Idrottsfysioterapi i Stockholm
          </p>
          
          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              variant="secondary"
              className="min-h-14 w-auto border border-white px-7 py-3.5 text-lg shadow-[var(--shadow-button)] transition-shadow hover:shadow-[var(--shadow-hover)] sm:min-h-11 sm:px-7 sm:py-5 sm:text-base"
            >
              <BookingLink aria-label="Gå till bokningssidan">
                <Calendar className="mr-2 h-5 w-5" />
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
