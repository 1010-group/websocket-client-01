import React from 'react';
import { Link } from 'react-router-dom';
import FuzzyText from '../Components/FuzzyText';

const NotFound = () => {
  const baseIntensity = 0.21;
  const hoverIntensity = 1.21;
  const enableHover = true;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-center p-6 gap-4">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="glitch">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <FuzzyText
        baseIntensity={baseIntensity}
        hoverIntensity={hoverIntensity}
        enableHover={enableHover}
      >
        404
      </FuzzyText>

      <FuzzyText
        baseIntensity={baseIntensity}
        hoverIntensity={hoverIntensity}
        enableHover={enableHover}
      >
        Page Not Found
      </FuzzyText>

     

      <Link to="/" className="btn btn-outline btn-primary mt-10 text-lg">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
