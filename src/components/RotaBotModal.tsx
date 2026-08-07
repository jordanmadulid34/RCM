import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, Trash2, RefreshCw, Copy, Check, MessageSquare, ChevronRight, HelpCircle, Volume2, VolumeX, Globe } from 'lucide-react';
import { TabType } from '../types';
import { RotaryWheelSVG } from './RCMLogo';
import { useI18n } from '../i18n/I18nContext';
import { VOICE_SUPPORT_MAP } from '../i18n/countryMapping';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

interface RotaBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  setActiveTab?: (tab: TabType) => void;
}

export const RotaBotModal: React.FC<RotaBotModalProps> = ({
  isOpen,
  onClose,
  isDark,
  setActiveTab,
}) => {
  const { country, locale, languageName, t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const voiceConfig = VOICE_SUPPORT_MAP[locale] || { voiceSupported: false, langCode: 'en-US' };

  // Set welcome message dynamically on locale change
  useEffect(() => {
    const welcomeMsg = t('chatbot.welcome');
    setMessages([
      {
        id: 'welcome-1',
        role: 'assistant',
        content: welcomeMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [locale]);

  // Speech synthesis TTS helper
  const speakText = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !isVoiceEnabled) return;

    // Fallback gracefully if language doesn't support TTS natively
    if (!voiceConfig.voiceSupported) {
      console.log(`TTS voice synthesis unavailable for locale '${locale}'. Falling back smoothly to text response.`);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      // Strip markdown bold/italics symbols for natural speech
      const cleanText = textToSpeak.replace(/[\*\#\_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = voiceConfig.langCode;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e instanceof Error ? e.message : String(e));
      setIsSpeaking(false);
    }
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Build history payload
      const historyPayload = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: historyPayload,
          country: country.name,
          locale,
          preferredLanguage: languageName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botText = data.text || 'I am ready to assist you with any questions regarding the Rotary Club of Makati!';
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      speakText(botText);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered a temporary network issue. Please make sure the dev server is active or try asking again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared. How else can I assist you with the Rotary Club of Makati?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper to render bold markdown formatting simply
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Format bold text **words**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={lineIdx} className={lineIdx > 0 ? 'mt-1' : ''}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-extrabold text-[#F7A81B] font-serif">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Modal Box Container */}
      <div
        className="w-full max-w-2xl h-[85vh] max-h-[680px] rounded-[18px] shadow-2xl flex flex-col overflow-hidden border border-white/10 bg-[#0F172A] text-[#CBD5E1]"
      >
        {/* Modal Top Header */}
        <div className="bg-[#16233B] px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="h-10 px-2 rounded-2xl bg-[#011E41] flex items-center justify-center text-[#F7A81B] shadow-lg shrink-0 border border-[#F7A81B]/40">
              <RotaryWheelSVG className="h-7 w-auto" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg font-extrabold text-[#F8FAFC]">{t('chatbot.title')}</h3>
                <span className="bg-[#17458F] text-white text-[10px] font-montserrat font-bold px-2 py-0.5 rounded-full border border-white/20">
                  Online
                </span>
                <span className="bg-[#F7A81B]/20 text-[#F7A81B] text-[10px] font-montserrat font-bold px-2 py-0.5 rounded-full border border-[#F7A81B]/40 flex items-center space-x-1">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </span>
              </div>
              <p className="text-[11px] font-sans text-[#CBD5E1]">
                {t('chatbot.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Voice Synthesis Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) window.speechSynthesis?.cancel();
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isVoiceEnabled && voiceConfig.voiceSupported
                  ? 'text-[#F7A81B] bg-white/10 hover:bg-white/20'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10'
              }`}
              title={
                !voiceConfig.voiceSupported
                  ? t('chatbot.textFallbackNotice')
                  : isVoiceEnabled
                  ? t('chatbot.voiceOn')
                  : t('chatbot.voiceOff')
              }
            >
              {isVoiceEnabled && voiceConfig.voiceSupported ? (
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-[#F7A81B]' : ''}`} />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#F7A81B] border border-[#F7A81B]/30 hover:bg-white/10 transition-colors cursor-pointer"
              title="Close RotaBot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Mode or Text Fallback Notification Banner */}
        {!voiceConfig.voiceSupported && (
          <div className="bg-[#F7A81B]/15 border-b border-[#F7A81B]/30 px-4 py-1.5 text-[11px] text-[#F7A81B] font-medium flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{t('chatbot.textFallbackNotice')}</span>
            </span>
            <span className="text-[10px] opacity-80 uppercase tracking-wider font-bold">Text Mode</span>
          </div>
        )}

        {/* Quick Suggestion Pills Banner */}
        <div className="px-4 py-2 border-b border-white/10 bg-white/5 text-xs flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[#F7A81B] font-montserrat font-bold text-[11px] shrink-0 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask RotaBot:</span>
          </span>
          {[
            t('chatbot.suggested1'),
            t('chatbot.suggested2'),
            t('chatbot.suggested3'),
            t('chatbot.suggested4'),
          ].map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer border bg-white/5 hover:bg-[#17458F] hover:text-white text-[#CBD5E1] border-white/10"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#0A0F1D]/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`h-8 px-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-bold text-xs ${
                    isUser
                      ? 'bg-[#17458F] text-white border border-white/20'
                      : 'bg-[#011E41] text-[#F7A81B] border border-[#F7A81B]/40'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <RotaryWheelSVG className="h-5 w-auto" />}
                </div>

                {/* Message Bubble */}
                <div className="max-w-[82%] sm:max-w-[78%] group relative">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-[#17458F] text-white rounded-tr-none border border-white/20'
                        : 'bg-white/10 border border-white/10 text-[#F8FAFC] rounded-tl-none'
                    } ${msg.isError ? 'border-red-500 bg-red-500/10 text-red-300' : ''}`}
                  >
                    {renderFormattedText(msg.content)}

                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/10 text-[10px] text-[#94A3B8]">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 hover:text-[#F7A81B] cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="h-8 px-1.5 rounded-xl bg-[#011E41] text-[#F7A81B] border border-[#F7A81B]/40 flex items-center justify-center font-bold shrink-0 shadow-sm animate-pulse">
                <RotaryWheelSVG className="h-5 w-auto" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none text-xs border border-white/10 bg-white/10 text-[#F8FAFC]">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#F7A81B] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#F7A81B] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#F7A81B] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] font-montserrat font-semibold text-[#F7A81B] ml-2">
                    RotaBot is searching club records...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer Form */}
        <div className="p-3 sm:p-4 border-t border-white/10 shrink-0 bg-[#16233B]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask RotaBot AI about RCM meetings, projects, membership..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm font-sans focus:outline-none transition-colors border border-white/10 bg-white/5 text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#17458F]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#F7A81B] hover:bg-[#D98E0E] text-[#0F172A] font-montserrat font-extrabold px-4 sm:px-5 py-3 rounded-2xl shadow-lg flex items-center justify-center space-x-1.5 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider">Send</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-2 px-1 font-sans">
            <span>Powered by Gemini AI • Rotary District 3830</span>
            {setActiveTab && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveTab('Membership');
                }}
                className="text-[#F7A81B] hover:underline font-bold cursor-pointer"
              >
                Apply for Membership →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
