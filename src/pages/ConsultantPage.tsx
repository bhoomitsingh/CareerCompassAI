import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Bot, User, ArrowLeft, Info } from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { generateMockResponse, getQuickReplies, buildSystemContext } from '@/ai-consultant/mockService';
import { rankCareers } from '@/career-engine/matching';
import type { ChatMessage } from '@/types';

export function ConsultantPage() {
  const { session, navigate } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const matches = session.assessment.completed ? rankCareers(session.assessment.scores) : [];
  const ctx = {
    profile: session.profile,
    scores: session.assessment.scores,
    matches,
  };

  useEffect(() => {
    // Greeting on mount
    setMessages([
      {
        id: 'greet',
        role: 'assistant',
        content:
          'Hi, I am your Career Compass AI consultant. ' +
          (session.assessment.completed
            ? `I have your assessment results and career matches. Ask me why a career fits, compare paths, discuss salaries or how to enter an industry.`
            : 'Take the assessment first so I can give you personalised answers. In the meantime, I can answer general career questions.'),
        timestamp: Date.now(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate AI latency
    setTimeout(() => {
      const response = generateMockResponse(text, ctx);
      const aiMsg: ChatMessage = { id: `a-${Date.now()}`, role: 'assistant', content: response, timestamp: Date.now() };
      setMessages((m) => [...m, aiMsg]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-4 sm:px-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('dashboard')} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-teal/15 text-accent-teal ring-1 ring-accent-teal/30">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-white">AI Career Consultant</p>
            <p className="text-xs text-slate-500">
              {session.assessment.completed ? 'Context: your assessment & matches' : 'General mode'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/8 bg-ink-900/40 p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {typing && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Bot className="h-4 w-4" />
            <span className="flex gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-teal/60" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-teal/60" style={{ animationDelay: '0.15s' }} />
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-teal/60" style={{ animationDelay: '0.3s' }} />
            </span>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="mt-3 flex flex-wrap gap-2">
        {getQuickReplies().map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-accent-teal/30 hover:text-accent-teal"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a career, salary, qualifications..."
          className="input flex-1"
        />
        <button type="submit" disabled={!input.trim()} className="btn-primary !px-4">
          <Send className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600">
        <Info className="h-3 w-3" />
        Mock AI responses for this prototype. Architecture is ready for secure OpenAI API integration.
      </p>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${isUser ? 'bg-white/5 text-slate-300' : 'bg-accent-teal/15 text-accent-teal ring-1 ring-accent-teal/30'}`}>
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </span>
      <div className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? 'bg-accent-teal/10 text-white' : 'bg-white/5 text-slate-200'}`}>
        {message.content}
      </div>
    </div>
  );
}
