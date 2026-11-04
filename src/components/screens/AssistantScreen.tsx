import React, { useState, useEffect, useRef } from 'react';
import { Invention, ChatMessage } from '../../types/invention';
import { StorageService } from '../../services/storage';
import { InventaApi } from '../../services/inventaApi';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  Trash2,
  RefreshCw,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AssistantScreenProps {
  selectedInvention?: Invention | null;
  inventions: Invention[];
  onSelectInvention: (inv: Invention | null) => void;
  onBack: () => void;
}

const QUICK_PROMPTS = [
  'How do I test boundary seal tightness safely?',
  'Suggest low-cost fasteners to replace custom machining.',
  'Help me formulate a Google Patents search query.',
  'What are common failure modes during initial assembly?'
];

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  selectedInvention,
  inventions,
  onSelectInvention,
  onBack
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = StorageService.getChatHistory();
    if (saved && saved.length > 0) return saved;
    return [
      {
        id: 'msg-init',
        role: 'assistant',
        content: `Greetings Inventor. I am your INVENTA Laboratory Assistant. I provide practical physics, component selection advice, safety audits, and patent prior art guidance.\n\nI am grounded in engineering constraints: I never fabricate test results or pretend untested designs are certified. How can I assist your build today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    StorageService.saveChatHistory(messages);
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = newHistory.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await InventaApi.askAssistant(historyForApi, selectedInvention);

      const assistantMsg: ChatMessage = {
        id: 'msg-bot-' + Date.now(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `INVENTA Copilot is temporarily unavailable. ${err.message || 'Please try again shortly.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const rewindTo = (messageId: string) => {
    const rewinded = StorageService.rewindChat(messageId);
    setMessages(rewinded.length > 0 ? rewinded : [{
      id: 'msg-reset-' + Date.now(),
      role: 'assistant',
      content: 'Conversation rewound. What should we change in this direction?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const clearChat = () => {
    const initial: ChatMessage = {
      id: 'msg-reset',
      role: 'assistant',
      content: 'Laboratory session reset. What prototype challenge or material question shall we examine?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initial]);
    StorageService.saveChatHistory([initial]);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#0B0F19] text-slate-100">
      {/* Top Context Bar */}
      <div className="shrink-0 space-y-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                AI Invention Assistant
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                ENGINEERING MENTOR · GROQ / GEMINI
              </span>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-white/[0.04] transition-colors"
            title="Reset Laboratory Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Invention Context Pill / Dropdown */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#0F172A] border border-white/[0.08] text-xs">
          <Layers className="w-4 h-4 text-violet-400 shrink-0" />
          <span className="text-slate-400 text-[11px] shrink-0 font-medium">Focus:</span>
          <select
            value={selectedInvention?.id || ''}
            onChange={(e) => {
              const found = inventions.find((inv) => inv.id === e.target.value);
              onSelectInvention(found || null);
            }}
            className="flex-1 bg-transparent text-xs font-bold text-white focus:outline-none truncate cursor-pointer"
          >
            <option value="" className="bg-[#0F172A] text-slate-300">
              -- General Invention Lab Inquiry --
            </option>
            {inventions.map((inv) => (
              <option key={inv.id} value={inv.id} className="bg-[#0F172A] text-slate-100">
                {inv.name} (${inv.costRange?.min}-${inv.costRange?.max} USD)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
        {messages.map((m, messageIndex) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed space-y-2 ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-md shadow-lg shadow-violet-950/40'
                  : 'bg-[#0F172A] border border-white/[0.08] text-slate-200 rounded-tl-md shadow-md'
              }`}
            >
              <div className="whitespace-pre-line font-normal">{m.content}</div>
              <div className="flex items-center justify-end gap-2">
                {messageIndex > 0 && (
                  <button onClick={() => rewindTo(m.id)} className="text-[9px] text-slate-400 hover:text-cyan-300" title="Rewind conversation to this message">
                    Rewind
                  </button>
                )}
                <div
                  className={`text-[9px] font-mono ${
                    m.role === 'user' ? 'text-violet-200' : 'text-slate-400'
                  } text-right`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-[#0F172A] rounded-2xl border border-white/[0.06] w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Inventa is thinking... high traffic, retrying in 10s</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="shrink-0 pt-2 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#131B2E] border border-white/[0.08] text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all shadow-sm"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <div className="shrink-0 pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedInvention
                ? `Ask about ${selectedInvention.name}...`
                : 'Ask engineering, prior art, or materials questions...'
            }
            className="w-full pl-4 pr-12 py-3.5 bg-[#0F172A] border border-white/[0.08] focus:border-cyan-400 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 transition-all shadow-md active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
