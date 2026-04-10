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
    <div className="relative h-screen w-full flex flex-col overflow-hidden selection:bg-amber-neon selection:text-black">
      <Background />
      <div className="grain" />
      <div className="scanline" />
      <GlitchOverlay active={threatLevel > 60} />
      
      {/* Premium Header */}
      <header className="relative z-50 flex items-center justify-between px-12 py-6">
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

      <main className="flex-1 px-12 pb-8 grid grid-cols-12 gap-8 relative z-40 min-h-0">
        {/* Left Column: Stats & Logs */}
        <div className="col-span-3 flex flex-col gap-8 min-h-0">
          <div className="bento-card flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Attacker Stream</h3>
              <div className="px-2 py-0.5 rounded bg-red-threat/10 text-red-threat text-[8px] font-bold">LIVE</div>
            </div>
            <div className="flex-1 overflow-hidden">
              <AttackerStream logs={attackerLogs} />
            </div>
          </div>
          
          <div className="bento-card h-64 shrink-0">
            <Radar threatLevel={threatLevel} />
          </div>
        </div>

        {/* Center Column: Main Visualization */}
        <div className="col-span-6 flex flex-col gap-8 min-h-0">
          <div className="bento-card flex-1 relative flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-10 left-10 z-10">
              <h2 className="text-5xl font-black tracking-tighter leading-[0.9] mb-4">
                The Intelligent <br />
                <span className="text-amber-neon text-glow-amber">Sphere</span>
              </h2>
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <p className="text-[10px] opacity-40 tracking-[0.3em] uppercase font-bold">Where Data Shapes the Future</p>
              </div>
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="w-full h-full p-12 overflow-y-auto scrollbar-hide"
                >
                  <div className="grid grid-cols-3 gap-6 h-full">
                    <div className="glass-panel flex flex-col">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-neon shadow-[0_0_10px_#FFB000]" />
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Deception Matrix</h4>
                      </div>
                      <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                        {deceptionLogs.slice(0, 4).map(log => (
                          <div key={log.id} className="relative pl-4 border-l border-white/5 group">
                            <div className="absolute -left-[1px] top-0 w-[1px] h-0 bg-amber-neon group-hover:h-full transition-all duration-500" />
                            <div className="flex justify-between text-[8px] font-mono opacity-30 uppercase tracking-widest mb-2">
                              <span>{log.timestamp}</span>
                              <span className="text-amber-neon/50">{log.mutation}</span>
                            </div>
                            <p className="text-xs font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                              {log.response}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel flex flex-col">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-data shadow-[0_0_10px_#00F0FF]" />
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Digital DNA</h4>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center gap-8">
                        <div className="flex gap-1.5 h-32 items-end">
                          {digitalDNA.join('').split('').slice(0, 24).map((char, i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                height: [
                                  `${30 + Math.random() * 70}%`, 
                                  `${30 + Math.random() * 70}%`, 
                                  `${30 + Math.random() * 70}%`
                                ],
                                opacity: [0.2, 0.8, 0.2]
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 1.5 + Math.random(), 
                                delay: i * 0.03 
                              }}
                              className="w-1 bg-cyan-data rounded-full shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                            />
                          ))}
                        </div>
                        <div className="text-center space-y-2">
                          <div className="text-[8px] uppercase tracking-[0.4em] opacity-30">Sequence Analysis</div>
                          <div className="text-[10px] font-mono text-cyan-data font-bold tracking-widest break-all px-4">
                            {digitalDNA.join(':')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel flex flex-col">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-threat shadow-[0_0_10px_#FF1F1F]" />
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">System Telemetry</h4>
                      </div>
                      <div className="flex-1 flex flex-col gap-4">
                        {[
                          { label: 'Neural Density', value: '84%', color: 'text-amber-neon', bg: 'bg-amber-neon/5' },
                          { label: 'Confusion Index', value: `${confusionIndex}%`, color: 'text-cyan-data', bg: 'bg-cyan-data/5' },
                          { label: 'Threat Vector', value: `${threatLevel}%`, color: 'text-red-threat', bg: 'bg-red-threat/5' },
                          { label: 'DNA Sync', value: 'Optimal', color: 'text-green-400', bg: 'bg-green-400/5' },
                        ].map(stat => (
                          <div key={stat.label} className={cn("p-5 rounded-2xl flex justify-between items-center border border-white/5", stat.bg)}>
                            <span className="text-[9px] uppercase tracking-widest opacity-40 font-bold">{stat.label}</span>
                            <span className={cn("text-xl font-black tracking-tighter", stat.color)}>{stat.value}</span>
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
              <div className="text-xs font-mono font-bold tracking-widest text-cyan-data text-glow-cyan">{digitalDNA.join(':')}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Deception & Alerts */}
        <div className="col-span-3 flex flex-col gap-8 min-h-0">
          <div className="bento-card flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Deception Engine</h3>
              <div className="w-2 h-2 rounded-full bg-amber-neon animate-pulse" />
            </div>
            <div className="flex-1 overflow-hidden">
              <DeceptionEngine logs={deceptionLogs} isEngaging={isEngaging} />
            </div>
          </div>

          <div className={cn(
            "bento-card h-48 shrink-0 flex flex-col justify-center items-center text-center transition-colors duration-500",
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


