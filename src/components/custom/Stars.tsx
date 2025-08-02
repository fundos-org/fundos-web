import { FC } from 'react';

const Stars: FC<{ starColor: string }> = ({ starColor }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className={`absolute w-2 h-2 ${starColor} rounded-full top-10 left-20 animate-twinkle`}
      />
      <div
        className={`absolute w-1 h-1 ${starColor} rounded-full top-20 right-30 animate-twinkle delay-1000`}
      />
      <div
        className={`absolute w-2 h-2 ${starColor} rounded-full bottom-40 left-40 animate-twinkle delay-500`}
      />
      <div
        className={`absolute w-1 h-1 ${starColor} rounded-full bottom-20 right-20 animate-twinkle delay-1500`}
      />
      <div
        className={`absolute w-2 h-2 ${starColor} rounded-full top-40 right-60 animate-twinkle delay-2000`}
      />
      <div
        className={`absolute w-1 h-1 ${starColor} rounded-full top-16 left-60 animate-twinkle delay-300`}
      />
      <div
        className={`absolute w-2 h-2 ${starColor} rounded-full bottom-60 right-40 animate-twinkle delay-1200`}
      />
      <div
        className={`absolute w-1 h-1 ${starColor} rounded-full top-80 left-10 animate-twinkle delay-1800`}
      />
      <div
        className={`absolute w-2 h-2 ${starColor} rounded-full bottom-10 left-80 animate-twinkle delay-600`}
      />
      <div
        className={`absolute w-1 h-1 ${starColor} rounded-full top-50 right-80 animate-twinkle delay-900`}
      />
      <div
        className={`absolute w-2 h-2 ${starColor} rounded-full bottom-30 left-30 animate-twinkle delay-2500`}
      />
      <div
        className={`absolute w-1 h-1 ${starColor} rounded-full top-30 right-10 animate-twinkle delay-400`}
      />
    </div>
  );
};

export default Stars;
