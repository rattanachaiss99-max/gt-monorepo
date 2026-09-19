import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * -------------------------------------------------------------
 * บังคับให้หน้าเว็บเลื่อนกลับไปบนสุด (top: 0, left: 0) ทุกครั้งที่มีการเปลี่ยนหน้า (Route Navigation)
 * ป้องกันไม่ให้หน้าเว็บเลื่อนค้างอยู่ตรงกลางหรือตำแหน่งเดิมจากหน้าที่แล้ว
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  // ปิด browser automatic scroll restoration เพื่อไม่ให้เบราว์เซอร์จำตำแหน่ง scroll เก่าข้ามหน้า
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // หากมี anchor hash ให้ข้ามเพื่อให้เบราว์เซอร์เลื่อนไปยัง id นั้น
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // 1. เลื่อนกลับไปบนสุดทันทีใน Layout phase
    resetScroll();

    // 2. ป้องกัน Layout shift จากการเรนเดอร์ Async หรือโหลดรูปภาพ
    const rafId = requestAnimationFrame(resetScroll);
    const timerId = setTimeout(resetScroll, 20);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname, search, hash]);

  return null;
}

