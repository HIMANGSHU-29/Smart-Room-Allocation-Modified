import React from 'react';
import Lottie from 'react-lottie-player';
import animationData from '../assets/classroom_animation.json';

export default function LottieClassroom() {
  return (
    <div className="w-full max-w-lg lg:max-w-2xl mx-auto drop-shadow-2xl relative">
       {/* Decorative backdrop for the lottie */}
       <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-indigo-50/50 rounded-[3rem] -z-10 rotate-3 scale-105 transition-transform duration-700 hover:rotate-6 hover:scale-110"></div>
       <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[3rem] -z-10 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"></div>
       
       <Lottie
        loop
        animationData={animationData}
        play
        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.05))' }}
      />
    </div>
  );
}
