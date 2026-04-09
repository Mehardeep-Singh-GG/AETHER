import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Cpu, Dna, Zap } from 'lucide-react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const bootLogs = [
    "Initializing AETHER Core...",
    "Loading Digital DNA sequences...",
    "Calibrating Deception Engine...",
    "Establishing Neural Grid...",
    "Syncing Threat Telemetry...",
    "Bypassing passive detection...",
    "Activating Reactive Intelligence...",
    "System Ready."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
        setProgress(p => Math.min(100, p + 12.5));
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="relative"
          >
            <Shield size={64} className="text-amber-neon filter drop-shadow-[0_0_15px_rgba(255,176,0,0.5)]" />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Zap size={24} className="text-white" />
            </motion.div>
          </motion.div>
          <h1 className="text-2xl font-black tracking-[0.5em] uppercase glitch-text" data-text="AETHER">AETHER</h1>
        </div>

        <div className="space-y-4">
          <div className="h-1 bg-amber-neon/10 rounded-full overflow-hidden border border-amber-neon/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-amber-neon shadow-[0_0_10px_rgba(255,176,0,0.8)]"
            />
          </div>
          
          <div className="h-32 overflow-hidden font-mono text-[10px] space-y-1 opacity-60">
            <AnimatePresence mode="popLayout">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <span className="text-amber-neon/40">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center gap-8 opacity-40">
          <Cpu size={16} className="animate-pulse" />
          <Dna size={16} className="animate-pulse delay-75" />
          <Zap size={16} className="animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
};
