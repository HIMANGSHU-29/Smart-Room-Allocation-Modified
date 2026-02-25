import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // Reveal animation
    tl.fromTo(
      lettersRef.current,
      {
        y: 40,
        opacity: 0,
        rotateX: -30
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.17,
        ease: 'power4.out'
      }
    )
      .to(containerRef.current, {
        y: '-100%',
        duration: 0.8,
        ease: 'power4.inOut',
        delay: 0.7,
      });

    return () => tl.kill();
  }, [onComplete]);

  const text = "AllocateU";

  return (
    <div className="splash-container" ref={containerRef}>
      <div className="splash-content">
        <h1 className="splash-text" ref={textRef}>
          {text.split('').map((char, index) => (
            <span
              key={index}
              ref={el => lettersRef.current[index] = el}
              className="splash-char"
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
