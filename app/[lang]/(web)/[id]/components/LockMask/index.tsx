import React from 'react';
import { FaLock } from 'react-icons/fa6';

interface LockMaskProp {
  text?: string;
}

const LockMask: React.FC<LockMaskProp> = ({ text }) => {
  return (
    <div className="flex-center absolute left-[-10px] top-[-10px] z-[10] h-[calc(100%+20px)] w-[calc(100%+20px)] rounded-[16px] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-[4px] text-[#0B0D41]">
        <FaLock size={32} className="text-neutral-medium-gray" />
        <p className="body-l text-[#0B0D41]">{text}</p>
      </div>
    </div>
  );
};

export default LockMask;
