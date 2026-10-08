import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ChatMessage } from '../../types';
import {
  Sparkles,
  Send,
  RefreshCw,
  Award,
  Video,
  Mic,
  MessageSquare,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface Props {
  initialJobTitle?: string;
  initialCompany?: string;
}

export const AIMockInterviewRoom: React.FC<Props> = ({
  initialJobTitle = 'Software Development Engineer - Backend (Java / Spring)',
  initialCompany = 'TechCorp Systems',
}) => {
  const { user } = useAuth();
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [companyName, setCompanyName] = useState(initialCompany);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      content: `Hello ${user?.name || 'Alex'}! I am your Technical Interviewer for the ${initialJobTitle} position at ${initialCompany}. To start off, please introduce yourself, your engineering focus, and tell me about one of the backend systems you've built recently.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setSending(true);

    try {
      const res = await api.sendMockInterviewMessage(
        newMessages,
        jobTitle,
        companyName,
        user?.name || 'Alex'
      );

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error('Mock interview failed', e);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          content: `Great points! Let's examine transaction consistency: In your distributed task scheduler, what happens when an async worker fails midway through processing a task? How do you prevent partial state corruption?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleResetSession = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        content: `Hello ${user?.name || 'Alex'}! I am your Technical Interviewer for the ${jobTitle} position at ${companyName}. To kick things off, introduce yourself and summarize the most technically challenging backend problem you've tackled.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive AI Simulator</span>
          </div>
          <h1 className="text-xl font-black text-slate-900">
            Virtual Mock Technical Interview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time conversational simulation with Gemini acting as Lead Technical Interviewer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSession}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restart Session</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[580px]">
        {/* Chat Room Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-2">
                <span>{companyName} Technical Chamber</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Target Role: {jobTitle}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>Candidate: {user?.name || 'Alex'}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Round 1 (In Progress)</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="font-medium">{m.content}</div>
                <div
                  className={`text-[10px] mt-1.5 ${
                    m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 font-medium pl-1">
                  Interviewer is formulating feedback and probing question...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
            Quick responses:
          </span>
          <button
            onClick={() =>
              handleSendMessage(
                'I built a distributed task queue using Java Spring Boot and Redis to handle asynchronous message queues, with idempotency tokens to prevent duplicate executions.'
              )
            }
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-xs font-medium"
          >
            Explain Task Queue Architecture
          </button>
          <button
            onClick={() =>
              handleSendMessage(
                'We use Spring transactions with @Transactional and isolate database locks with optimistic locking via version columns to guarantee consistency under high load.'
              )
            }
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-xs font-medium"
          >
            Discuss Database Locking & Isolation
          </button>
          <button
            onClick={() =>
              handleSendMessage(
                'I monitor request latency with Prometheus metrics, inspect slow query logs in MySQL, and profile thread dump bottlenecks using JConsole.'
              )
            }
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-xs font-medium"
          >
            Triage Production Latency
          </button>
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your engineering answer or ask for clarification..."
              className="flex-1 p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Send Answer</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
