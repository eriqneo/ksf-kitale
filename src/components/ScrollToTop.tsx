import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, let the browser handle it or scroll to the element
    if (hash) {
      const scrollToHash = () => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      // Try immediately
      const success = scrollToHash();
      
      // If not succeeded yet, try at various intervals (handles lazy loading or animations)
      if (!success) {
        const timer1 = setTimeout(scrollToHash, 100);
        const timer2 = setTimeout(scrollToHash, 500);
        const timer3 = setTimeout(scrollToHash, 1000);
        const timer4 = setTimeout(scrollToHash, 2100); // After preloader finishes
        
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
        };
      }
    } else {
      // Otherwise scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
