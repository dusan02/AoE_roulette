import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface LeverProps {
  isSpinning: boolean;
  onPull: () => void;
}

export const Lever = ({ isSpinning, onPull }: LeverProps) => {
  return (
    <motion.button
      onClick={onPull}
      disabled={isSpinning}
      whileHover={isSpinning ? {} : { scale: 1.03, y: -2 }}
      whileTap={isSpinning ? {} : { scale: 0.95, y: 6 }}
      animate={{ y: isSpinning ? [0, 3, -1, 0] : 0 }}
      transition={{ duration: 0.45, repeat: isSpinning ? Infinity : 0 }}
      className="relative flex items-center gap-3 font-bold py-4 px-8 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: 'linear-gradient(170deg, #e8c447 0%, #c8a020 40%, #a07810 100%)',
        boxShadow: isSpinning
          ? '0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 10px 28px rgba(0,0,0,0.45), 0 2px 0 #7a5a08, inset 0 1px 0 rgba(255,255,255,0.3)',
        border: '2px solid #c8a020',
        color: '#1a0a00',
      }}
    >
      {/* wood handle stub left */}
      <div
        className="absolute -left-7 top-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 22, height: 68, background: 'linear-gradient(90deg, #3a1e06, #5c3010, #3a1e06)', border: '2px solid #a07030' }}
      />
      {/* red knob */}
      <motion.div
        className="absolute -left-9 rounded-full"
        style={{
          top: -6, width: 28, height: 28,
          background: 'radial-gradient(circle at 35% 30%, #ff6060, #cc1010)',
          border: '2px solid #ff9090',
          boxShadow: '0 4px 14px rgba(200,0,0,0.55)',
        }}
        animate={{ y: isSpinning ? [0, 3, -1, 0] : 0 }}
        transition={{ duration: 0.45, repeat: isSpinning ? Infinity : 0 }}
      />

      <motion.div
        animate={{ rotate: isSpinning ? 360 : 0 }}
        transition={{ duration: 0.9, repeat: isSpinning ? Infinity : 0, ease: 'linear' }}
        className="relative z-10"
      >
        <Zap size={22} />
      </motion.div>
      <span className="text-xl font-black tracking-wider relative z-10">PULL LEVER</span>
    </motion.button>
  );
};
