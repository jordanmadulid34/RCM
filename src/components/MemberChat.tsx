import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  ArrowLeft,
  User,
  ShieldCheck,
  CheckCheck,
  Paperclip,
  Circle,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  roleTitle: string;
  avatarUrl?: string;
  initials: string;
  online: boolean;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    name: 'PP Bruno Gouback',
    roleTitle: 'Past President & Board Director',
    initials: 'BG',
    online: true,
    unreadCount: 2,
    lastMessage: 'Good day! Are you attending the upcoming Tuesday luncheon at Peninsula Manila?',
    lastTime: '10:42 AM',
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Greetings Rotarian! Hope you are doing well.',
        timestamp: '10:30 AM',
      },
      {
        id: 'm2',
        sender: 'them',
        text: 'Good day! Are you attending the upcoming Tuesday luncheon at Peninsula Manila?',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: 'conv-[#2]',
    name: 'Keith Ejay Balete',
    roleTitle: 'Club Admin & Member',
    initials: 'KB',
    online: true,
    unreadCount: 0,
    lastMessage: 'Your attendance record for the last community service project has been verified.',
    lastTime: 'Yesterday',
    messages: [
      {
        id: 'm3',
        sender: 'me',
        text: 'Hi Secretary, could you please check if my attendance for Saturday was recorded?',
        timestamp: 'Yesterday 3:15 PM',
      },
      {
        id: 'm4',
        sender: 'them',
        text: 'Your attendance record for the last community service project has been verified.',
        timestamp: 'Yesterday 4:00 PM',
      },
    ],
  },
  {
    id: 'conv-3',
    name: 'Secretariat Helpdesk',
    roleTitle: 'RC Makati Club Secretariat',
    initials: 'RC',
    online: false,
    unreadCount: 1,
    lastMessage: 'Please review the updated billing notice for Q3 dues.',
    lastTime: 'Jul 28',
    messages: [
      {
        id: 'm5',
        sender: 'them',
        text: 'Welcome to the RC Makati Member Portal messaging service. Feel free to send us any inquiries.',
        timestamp: 'Jul 28 09:00 AM',
      },
      {
        id: 'm6',
        sender: 'them',
        text: 'Please review the updated billing notice for Q3 dues.',
        timestamp: 'Jul 28 09:05 AM',
      },
    ],
  },
  {
    id: 'conv-4',
    name: 'Dir. Maria Santos',
    roleTitle: 'Youth Service Director',
    initials: 'MS',
    online: true,
    unreadCount: 0,
    lastMessage: 'Thank you for supporting the Rotaract mentorship kickoff!',
    lastTime: 'Jul 20',
    messages: [
      {
        id: 'm7',
        sender: 'me',
        text: 'Glad to help with the youth program budget review.',
        timestamp: 'Jul 20 2:00 PM',
      },
      {
        id: 'm8',
        sender: 'them',
        text: 'Thank you for supporting the Rotaract mentorship kickoff!',
        timestamp: 'Jul 20 2:30 PM',
      },
    ],
  },
];

interface MemberChatProps {
  currentMemberName?: string;
}

export const MemberChat: React.FC<MemberChatProps> = ({ currentMemberName = 'Member' }) => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = conversations.find((c) => c.id === selectedChatId) || null;

  // Filtered conversation list
  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Handle selecting a chat
  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    // Clear unread count for selected chat
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Handle sending a message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            lastMessage: newMsg.text,
            lastTime: newMsg.timestamp,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText('');
  };

  return (
    <div className="bg-[#0A2540] rounded-3xl border border-[#F7A81B]/30 shadow-2xl overflow-hidden min-h-[580px] flex flex-col">
      {/* ========================================================================= */}
      {/* MOBILE VIEW (Single Pane Mode: List OR Active Thread) - requirement #7 */}
      {/* ========================================================================= */}
      <div className="block lg:hidden flex-1 flex flex-col">
        {!selectedChatId ? (
          /* MOBILE VIEW 1: CONVERSATION LIST */
          <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider block">
                  Fellow Member Messaging
                </span>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#F7A81B]" />
                  <span>Conversations</span>
                </h3>
              </div>
              <span className="bg-[#011E41] text-[#F7A81B] text-xs font-mono font-bold px-2.5 py-1 rounded-full border border-[#F7A81B]/30">
                {conversations.reduce((acc, c) => acc + c.unreadCount, 0)} New
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member or keyword..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#011E41] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B]"
              />
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectChat(conv.id)}
                  className="p-3.5 bg-[#011E41] hover:bg-[#011E41]/80 rounded-2xl border border-white/5 active:scale-[0.98] transition cursor-pointer flex items-center justify-between space-x-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F7A81B] to-[#D98E0E] text-[#01142E] font-serif font-bold text-sm flex items-center justify-center shadow-md">
                        {conv.initials}
                      </div>
                      {conv.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#011E41] rounded-full" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-white text-sm truncate">{conv.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{conv.lastTime}</span>
                      </div>
                      <p className="text-[11px] text-[#F7A81B] font-medium truncate">{conv.roleTitle}</p>
                      <p className="text-xs text-slate-300 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>

                  {conv.unreadCount > 0 ? (
                    <span className="bg-[#F7A81B] text-[#01142E] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* MOBILE VIEW 2: ACTIVE CHAT THREAD WITH BACK BUTTON */
          <div className="flex-1 flex flex-col h-full min-h-[580px]">
            {/* Header with Back Button */}
            <div className="bg-[#011E41] p-4 border-b border-white/10 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedChatId(null)}
                  className="p-2 bg-[#0A2540] hover:bg-slate-800 text-[#F7A81B] rounded-xl border border-white/10 cursor-pointer flex items-center space-x-1 shrink-0 font-bold text-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F7A81B] to-[#D98E0E] text-[#01142E] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                    {activeConversation?.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-white text-sm truncate">{activeConversation?.name}</h4>
                    <p className="text-[10px] text-[#F7A81B] truncate">{activeConversation?.roleTitle}</p>
                  </div>
                </div>
              </div>

              {activeConversation?.online && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              )}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 bg-[#01142E]/80 overflow-y-auto space-y-3 min-h-[360px]">
              {activeConversation?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1 shadow-md ${
                      msg.sender === 'me'
                        ? 'bg-[#F7A81B] text-[#01142E] font-medium rounded-br-none'
                        : 'bg-[#011E41] text-slate-100 border border-white/10 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right font-mono ${
                        msg.sender === 'me' ? 'text-[#01142E]/70 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#011E41] border-t border-white/10 flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConversation?.name}...`}
                className="flex-1 bg-[#0A2540] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-[#F7A81B] hover:bg-[#D98E0E] disabled:opacity-50 text-[#01142E] rounded-xl font-bold cursor-pointer transition shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TABLET / DESKTOP VIEW (Side-by-Side 2-Pane Mode) - requirement #7 */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid grid-cols-12 flex-1 min-h-[580px]">
        {/* Left Pane: Conversations List */}
        <div className="col-span-5 border-r border-white/10 p-5 flex flex-col space-y-4 bg-[#011E41]/40">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-montserrat font-bold text-[#F7A81B] uppercase tracking-wider block">
                Fellow Member Messaging
              </span>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#F7A81B]" />
                <span>Conversations</span>
              </h3>
            </div>
            <span className="bg-[#011E41] text-[#F7A81B] text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-[#F7A81B]/30">
              {conversations.reduce((acc, c) => acc + c.unreadCount, 0)} New
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member..."
              className="w-full pl-9 pr-3 py-2 bg-[#011E41] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B]"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedChatId;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectChat(conv.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between space-x-3 ${
                    isSelected
                      ? 'bg-[#011E41] border-[#F7A81B] shadow-lg ring-1 ring-[#F7A81B]/40'
                      : 'bg-[#0A2540] hover:bg-[#011E41]/70 border-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7A81B] to-[#D98E0E] text-[#01142E] font-serif font-bold text-xs flex items-center justify-center shadow-md">
                        {conv.initials}
                      </div>
                      {conv.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0A2540] rounded-full" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-white text-xs truncate">{conv.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">{conv.lastTime}</span>
                      </div>
                      <p className="text-[10px] text-[#F7A81B] truncate">{conv.roleTitle}</p>
                      <p className="text-[11px] text-slate-300 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="bg-[#F7A81B] text-[#01142E] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Thread Chat Window */}
        <div className="col-span-7 flex flex-col bg-[#01142E]/90 h-full">
          {activeConversation ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Thread Header */}
              <div className="p-4 bg-[#011E41] border-b border-white/10 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7A81B] to-[#D98E0E] text-[#01142E] font-serif font-bold text-sm flex items-center justify-center">
                    {activeConversation.initials}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">{activeConversation.name}</h4>
                    <p className="text-xs text-[#F7A81B]">{activeConversation.roleTitle}</p>
                  </div>
                </div>

                {activeConversation.online ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Now
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-mono">Offline</span>
                )}
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 min-h-[380px] max-h-[440px]">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs space-y-1 shadow-md ${
                        msg.sender === 'me'
                          ? 'bg-[#F7A81B] text-[#01142E] font-medium rounded-br-none'
                          : 'bg-[#011E41] text-slate-100 border border-white/10 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right font-mono ${
                          msg.sender === 'me' ? 'text-[#01142E]/70 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="p-3.5 bg-[#011E41] border-t border-white/10 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Type a message to ${activeConversation.name}...`}
                  className="flex-1 bg-[#0A2540] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-[#F7A81B] hover:bg-[#D98E0E] disabled:opacity-50 text-[#01142E] rounded-xl font-bold text-xs cursor-pointer transition shadow-md flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-4 bg-[#011E41] rounded-2xl border border-white/10 text-[#F7A81B]">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">Select a Conversation</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Choose a fellow Rotarian or Secretariat thread from the left pane to send direct messages and updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
