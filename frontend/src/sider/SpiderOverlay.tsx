import { useEffect, useRef, useState } from 'react';
import edderkoppBilde from '../assets/edderkopp.png';

const SpiderOverlay = () => {
    const spiderRef = useRef<HTMLImageElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const spider = spiderRef.current;
        let animationFrameId: number;

        const moveSmoothly = (startX: number, startY: number, endX: number, endY: number) => {
            const duration = 3000; // 3 sek bevegelse
            const startTime = performance.now();

            const animate = (time: number) => {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;

                if (spider) {
                    spider.style.transform = `translate(${currentX}px, ${currentY}px)`;
                }

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                } else {
                    // Bevegelse ferdig, gjem og start ny runde
                    setTimeout(() => {
                        if (spider) spider.style.display = 'none';
                        setVisible(false);
                        const delay = Math.random() * 15000 + 5000; // neste runde
                        setTimeout(startSpider, delay);
                    }, 1000);
                }
            };

            animationFrameId = requestAnimationFrame(animate);
        };

        const startSpider = () => {
            if (!spider) return;

            setVisible(true);
            spider.style.display = 'block';

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            const startX = Math.random() * (screenWidth - 100);
            const startY = Math.random() * (screenHeight - 100);
            const endX = Math.random() * (screenWidth - 100);
            const endY = Math.random() * (screenHeight - 100);

            moveSmoothly(startX, startY, endX, endY);
        };

        const initialDelay = Math.random() * 5000 + 3000;
        const timer = setTimeout(startSpider, initialDelay);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <img
            ref={spiderRef}
            src={edderkoppBilde}
            alt="Realistisk edderkopp"
            style={{
                position: 'fixed',
                width: '80px',
                height: '80px',
                zIndex: 9999,
                pointerEvents: 'none',
                display: visible ? 'block' : 'none',
                transform: 'translate(0px, 0px)',
            }}
        />
    );
};

export default SpiderOverlay;
