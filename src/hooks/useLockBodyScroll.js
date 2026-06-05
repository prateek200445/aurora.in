import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling when a modal or overlay drawer is active.
 * Adds the 'no-scroll' class to the body and documentElement.
 * 
 * @param {boolean} isActive - Whether the scroll lock is active.
 */
export function useLockBodyScroll(isActive = true) {
  useEffect(() => {
    if (isActive) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, [isActive]);
}
