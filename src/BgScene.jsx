import React, { useEffect, useRef } from 'react';
import { reducedMotion } from './hooks.js';

/** Fixed, full-page 3D background: the meal assembles on a banana leaf as the page scrolls. */
export default function BgScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let dead = false;
    let cleanup = () => {};
    const still = reducedMotion();
    (async () => {
      try {
        const { createPlateScene } = await import('./plate3d.js');
        if (dead) return;
        const scene = createPlateScene(canvasRef.current, { instant: still });
        const measure = () => {
          if (still) return 1;
          const hero = document.getElementById('top');
          const end = document.getElementById('contact');
          const start = (hero ? hero.offsetHeight : 600) * 0.45;
          const stop = end ? end.offsetTop : document.documentElement.scrollHeight - window.innerHeight;
          return (window.scrollY - start) / Math.max(1, stop - start - window.innerHeight * 0.3);
        };
        const onScroll = () => scene.setProgress(measure());
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        scene.setActive(true);
        onScroll();
        canvasRef.current.classList.add('ready');
        cleanup = () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); scene.dispose(); };
      } catch (e) { /* no WebGL: the plain green page background remains */ }
    })();
    return () => { dead = true; cleanup(); };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />;
}
