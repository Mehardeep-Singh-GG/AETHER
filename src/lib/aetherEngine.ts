import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ai, DECEPTION_SYSTEM_PROMPT } from './gemini';

export interface AttackerAction {
  id: string;
  timestamp: string;
  layer: 'SSH' | 'HTTP' | 'SQL';
  action: string;
  maliciousness: number;
}

export interface DeceptionResponse {
  id: string;
  timestamp: string;
  response: string;
  analysis: string;
  mutation: string;
}

export const useAetherEngine = () => {
  const [threatLevel, setThreatLevel] = useState(12);
  const [confusionIndex, setConfusionIndex] = useState(45);
  const [attackerLogs, setAttackerLogs] = useState<AttackerAction[]>([]);
  const [deceptionLogs, setDeceptionLogs] = useState<DeceptionResponse[]>([]);
  const [isEngaging, setIsEngaging] = useState(false);
  const [digitalDNA, setDigitalDNA] = useState<string[]>(['0x4F', '0x12', '0xBC']);

  const logRef = useRef(attackerLogs);
  logRef.current = attackerLogs;

  const generateDeception = useCallback(async (action: AttackerAction) => {
    setIsEngaging(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Attacker DNA: ${digitalDNA.join(':')}\nAction: ${action.action} on ${action.layer}`,
        config: {
          systemInstruction: DECEPTION_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || '{}');
      
      const newDeception: DeceptionResponse = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        response: data.deception || "Synthesizing illusionary barrier...",
        analysis: data.analysis || "Tactical intent detected.",
        mutation: data.mutation || "DNA sequence updated.",
      };

      setDeceptionLogs(prev => [newDeception, ...prev].slice(0, 50));
      setConfusionIndex(prev => Math.min(100, prev + 5));
      setDigitalDNA(prev => [...prev, `0x${Math.floor(Math.random() * 256).toString(16).toUpperCase()}`].slice(-8));
    } catch (error) {
      console.error("AETHER Deception Error:", error);
    } finally {
      setIsEngaging(false);
    }
  }, [digitalDNA]);

  useEffect(() => {
    const interval = setInterval(() => {
      const layers: ('SSH' | 'HTTP' | 'SQL')[] = ['SSH', 'HTTP', 'SQL'];
      const actions = {
        SSH: ['Attempting root login', 'Brute forcing port 22', 'Scanning banners', 'Injecting shellcode'],
        HTTP: ['GET /admin', 'POST /login (SQLi attempt)', 'Scanning for .env', 'Directory traversal'],
        SQL: ['SELECT * FROM users', 'UNION SELECT null, version()', 'Dropping table logs', 'Honeytoken triggered'],
      };

      const layer = layers[Math.floor(Math.random() * layers.length)];
      const actionText = actions[layer][Math.floor(Math.random() * actions[layer].length)];
      
      const newAction: AttackerAction = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        layer,
        action: actionText,
        maliciousness: Math.floor(Math.random() * 100),
      };

      setAttackerLogs(prev => [newAction, ...prev].slice(0, 50));
      setThreatLevel(prev => {
        const delta = newAction.maliciousness > 70 ? 2 : -1;
        return Math.max(0, Math.min(100, prev + delta));
      });

      if (newAction.maliciousness > 60) {
        generateDeception(newAction);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [generateDeception]);

  return {
    threatLevel,
    confusionIndex,
    attackerLogs,
    deceptionLogs,
    isEngaging,
    digitalDNA,
  };
};
