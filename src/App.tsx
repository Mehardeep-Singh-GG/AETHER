import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAetherEngine } from './lib/aetherEngine';
import { SystemState } from './components/SystemState';
import { AttackerStream } from './components/AttackerStream';
import { DeceptionEngine } from './components/DeceptionEngine';
import { Brain } from './components/Brain';
import { Background } from './components/Background';
import { Globe } from './components/Globe';
import { Radar } from './components/Radar';
import { AlertCircle, Shield, Cpu, Globe as GlobeIcon, Zap } from 'lucide-react';
import { cn } from './lib/utils';

const GlitchOverlay = ({ active }: { active: boolean }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setVisible(true);
        setTimeout(() => setVisible(false), 100);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [active]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none mix-blend-difference opacity-30">
      <div className="absolute inset-0 bg-red-500 translate-x-1" />
      <div className="absolute inset-0 bg-cyan-500 -translate-x-1" />
    </div>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState<'NEURAL' | 'GLOBAL' | 'TACTICAL'>('NEURAL');
  const { 
    threatLevel, 
    confusionIndex, 
    attackerLogs, 
    deceptionLogs, 
    isEngaging,
    digitalDNA 
  } = useAetherEngine();

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden selection:bg-amber-neon selection:text-black">
      <Background />
      <GlitchOverlay active={threatLevel > 60} />
      
      {/* Premium Header */}
      <header className="relative z-50 flex items-center justify-between px-12 py-8">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-neon to-amber-neon/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,176,0,0.3)]">
            <Shield className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tighter uppercase glitch-text" data-text="AETHER">AETHER</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Autonomous Defense System</p>
          </div>
        </div>

        <nav className="flex gap-2 p-1 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
          {[
            { id: 'NEURAL', label: 'Neural', icon: <Cpu size={14} /> },
            { id: 'GLOBAL', label: 'Global', icon: <GlobeIcon size={14} /> },
            { id: 'TACTICAL', label: 'Tactical', icon: <Zap size={14} /> },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={cn(
                "px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 flex items-center gap-3",
                activeView === view.id 
                  ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {view.icon}
              {view.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest opacity-40 mb-1">System Status</div>
            <div className={cn(
              "text-xs font-black uppercase tracking-widest flex items-center gap-2 justify-end",
              isEngaging ? "text-red-threat" : "text-amber-neon"
            )}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {isEngaging ? 'Active Engagement' : 'Monitoring'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-12 pb-12 grid grid-cols-12 gap-8 relative z-40">
        {/* Left Column: Stats & Logs */}
        <div className="col-span-3 flex flex-col gap-8">
          <div className="bento-card flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Attacker Stream</h3>
              <div className="px-2 py-0.5 rounded bg-red-threat/10 text-red-threat text-[8px] font-bold">LIVE</div>
            </div>
            <div className="flex-1 overflow-hidden">
              <AttackerStream logs={attackerLogs} />
            </div>
          </div>
          
          <div className="bento-card h-64">
            <Radar threatLevel={threatLevel} />
          </div>
        </div>

        {/* Center Column: Main Visualization */}
        <div className="col-span-6 flex flex-col gap-8">
          <div className="bento-card flex-1 relative flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-8 left-8">
              <h2 className="text-4xl font-black tracking-tighter leading-none mb-2">
                The Intelligent <br />
                <span className="text-amber-neon text-glow-amber">Sphere</span>
              </h2>
              <p className="text-xs opacity-40 tracking-widest uppercase">Where Data Shapes the Future</p>
            </div>

            <AnimatePresence mode="wait">
              {activeView === 'NEURAL' && (
                <motion.div
                  key="neural"
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                  className="w-full h-full"
                >
                  <Brain threatLevel={threatLevel} isEngaging={isEngaging} />
                </motion.div>
              )}
              {activeView === 'GLOBAL' && (
                <motion.div
                  key="global"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  className="w-full h-full"
                >
                  <Globe threatLevel={threatLevel} />
                </motion.div>
              )}
              {activeView === 'TACTICAL' && (
                <motion.div
                  key="tactical"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full h-full p-12 overflow-y-auto scrollbar-hide"
                >
                  <div className="grid grid-cols-3 gap-8 h-full">
                    <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-40">Deception Matrix</h4>
                      <div className="space-y-6">
                        {deceptionLogs.slice(0, 4).map(log => (
                          <div key={log.id} className="space-y-2">
                            <div className="flex justify-between text-[9px] font-mono opacity-30 uppercase tracking-widest">
                              <span>{log.timestamp}</span>
                              <span>{log.mutation}</span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed italic opacity-80">"{log.response}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex flex-col">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-40">Digital DNA Analysis</h4>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex gap-1 h-32 items-end">
                          {digitalDNA.split('').map((char, i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                height: [
                                  `${20 + Math.random() * 80}%`, 
                                  `${20 + Math.random() * 80}%`, 
                                  `${20 + Math.random() * 80}%`
                                ],
                                opacity: [0.3, 1, 0.3]
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 2, 
                                delay: i * 0.05 
                              }}
                              className="w-1 bg-cyan-data rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <span className="text-[10px] font-mono text-cyan-data tracking-[0.5em]">{digitalDNA}</span>
                      </div>
                    </div>

                    <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-40">System Telemetry</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { label: 'Neural Density', value: '84%', color: 'text-amber-neon' },
                          { label: 'Confusion Index', value: `${confusionIndex}%`, color: 'text-cyan-data' },
                          { label: 'Threat Vector', value: `${threatLevel}%`, color: 'text-red-threat' },
                          { label: 'DNA Sync', value: 'Optimal', color: 'text-green-400' },
                        ].map(stat => (
                          <div key={stat.label} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest opacity-40">{stat.label}</span>
                            <span className={cn("text-lg font-black tracking-tighter", stat.color)}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-8 right-8 text-right">
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1">Digital DNA Sequence</div>
              <div className="text-xs font-mono font-bold tracking-widest text-cyan-data text-glow-cyan">{digitalDNA}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Deception & Alerts */}
        <div className="col-span-3 flex flex-col gap-8">
          <div className="bento-card flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Deception Engine</h3>
              <div className="w-2 h-2 rounded-full bg-amber-neon animate-pulse" />
            </div>
            <div className="flex-1 overflow-hidden">
              <DeceptionEngine logs={deceptionLogs} isEngaging={isEngaging} />
            </div>
          </div>

          <div className={cn(
            "bento-card h-48 flex flex-col justify-center items-center text-center transition-colors duration-500",
            threatLevel > 80 ? "bg-red-threat/20 border-red-threat/30" : "bg-white/[0.02]"
          )}>
            <AlertCircle className={cn("mb-4", threatLevel > 80 ? "text-red-threat" : "opacity-20")} size={32} />
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Threat Level</h4>
            <div className={cn(
              "text-5xl font-black tracking-tighter",
              threatLevel > 80 ? "text-red-threat" : "text-white"
            )}>
              {threatLevel}%
            </div>
          </div>
        </div>
      </main>

      <footer className="px-12 py-6 flex justify-between items-center relative z-50 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex gap-12 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-white rounded-full" />
            AETHER CORE v4.2.0
          </div>
          <div>LATENCY: 0.02MS</div>
          <div>UPTIME: 142:12:04</div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-1 rounded-full border border-white/10 text-[9px] font-bold uppercase tracking-widest opacity-40">
            Secure Connection
          </div>
          <div className="px-4 py-1 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest">
            Autonomous Mode
          </div>
        </div>
      </footer>
    </div>
  );
}


