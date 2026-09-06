import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

let lastScrolledPathname: string | null = null;

/** Scroll to top on route changes only — not when the current page remounts. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (lastScrolledPathname === pathname) return;
    lastScrolledPathname = pathname;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
