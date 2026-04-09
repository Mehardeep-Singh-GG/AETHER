import React from 'react';
import { motion } from 'motion/react';
import { AttackerAction } from '../lib/aetherEngine';
import { Terminal, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

interface AttackerStreamProps {
  logs: AttackerAction[];
}

export const AttackerStream: React.FC<AttackerStreamProps> = ({ logs }) => {
  return (
    <div className="flex flex-col h-full border-r border-amber-neon/20 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-amber-neon/20 flex items-center gap-2 bg-amber-neon/5">
        <Terminal size={16} className="text-amber-neon" />
        <span className="text-xs font-bold uppercase tracking-widest">Attacker Stream</span>
        <div className="ml-auto flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {logs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30
              }
            }}
            whileHover={{ x: 5 }}
            className={cn(
              "text-[10px] font-mono leading-relaxed p-2 border-l-2",
              log.maliciousness > 70 ? "border-red-threat bg-red-threat/5" : "border-amber-neon/30 bg-amber-neon/5"
            )}
          >
            <div className="flex justify-between items-center mb-1 opacity-50">
              <span>[{log.timestamp}]</span>
              <span className="font-bold">{log.layer}</span>
            </div>
            <div className="flex gap-2 items-start">
              {log.maliciousness > 70 && <ShieldAlert size={12} className="text-red-threat mt-0.5 shrink-0" />}
              <span className={log.maliciousness > 70 ? "text-red-threat" : ""}>
                {log.action}
              </span>
            </div>
            <div className="mt-2 h-1 bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${log.maliciousness}%` }}
                className={cn(
                  "h-full",
                  log.maliciousness > 70 ? "bg-red-threat" : "bg-amber-neon"
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
