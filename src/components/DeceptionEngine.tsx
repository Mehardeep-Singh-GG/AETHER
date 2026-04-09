import React from 'react';
import { motion } from 'motion/react';
import { DeceptionResponse } from '../lib/aetherEngine';
import { Cpu, Zap, Dna } from 'lucide-react';

interface DeceptionEngineProps {
  logs: DeceptionResponse[];
  isEngaging: boolean;
}

export const DeceptionEngine: React.FC<DeceptionEngineProps> = ({ logs, isEngaging }) => {
  return (
    <div className="flex flex-col h-full border-l border-amber-neon/20 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-amber-neon/20 flex items-center gap-2 bg-amber-neon/5">
        <Cpu size={16} className="text-amber-neon" />
        <span className="text-xs font-bold uppercase tracking-widest">Deception Engine</span>
        {isEngaging && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="ml-auto text-[8px] text-amber-neon border border-amber-neon px-1 rounded"
          >
            SYNTHESIZING
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
            <Zap size={48} />
            <p className="text-[10px] uppercase tracking-widest">Awaiting Threat Engagement</p>
          </div>
        )}
        
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-[10px] text-amber-neon/60">
              <Zap size={10} />
              <span className="uppercase tracking-tighter">Response Vector Generated</span>
              <span className="ml-auto">{log.timestamp}</span>
            </div>
            
            <div className="p-3 bg-amber-neon/10 border border-amber-neon/20 rounded relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-neon/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <p className="text-[11px] leading-relaxed italic text-white/90">
                "{log.response}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-black/40 border border-amber-neon/10 rounded">
                <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest opacity-50 mb-1">
                  <Cpu size={8} /> Analysis
                </div>
                <p className="text-[9px] leading-tight opacity-80">{log.analysis}</p>
              </div>
              <div className="p-2 bg-black/40 border border-amber-neon/10 rounded">
                <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest opacity-50 mb-1">
                  <Dna size={8} /> Mutation
                </div>
                <p className="text-[9px] leading-tight opacity-80">{log.mutation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
