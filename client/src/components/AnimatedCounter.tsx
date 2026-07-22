import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '', decimals = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const value = end * progress;

      if (decimals > 0) {
        setCount(parseFloat(value.toFixed(decimals)));
      } else {
        setCount(Math.floor(value));
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [end, duration, decimals]);

  const formattedCount = decimals > 0 ? count.toFixed(decimals) : count.toLocaleString();

  return (
    <>
      {prefix}
      {formattedCount}
      {suffix}
    </>
  );
}

export default AnimatedCounter;
