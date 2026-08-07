import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  X,
  Send,
  UserCheck,
  Shield,
  Award,
  Info,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { BOARD_OFFICERS, BOARD_DIRECTORS, BOARD_ADVISERS, BoardMember } from '../data/boardData';
import { ImageWithFallback } from './ImageWithFallback';

interface MemberDirectorySectionProps {
  isDark: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: string;
}

export const MemberDirectorySection: React.FC<MemberDirectorySectionProps> = ({ isDark }) => {
  // Combine all 24 real Board members from boardData.ts
  const allBoardMembers: BoardMember[] = [
    ...BOARD_OFFICERS,
    ...BOARD_DIRECTORS,
    ...BOARD_ADVISERS,
  ];

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'officers' | 'directors' | 'advisers'>('all');
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  
  // Chat state
  const [chatMember, setChatMember] = useState<BoardMember | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [inputText, setInputText] = useState('');

  // Filter members
  const filteredMembers = allBoardMembers.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Open Chat
  const handleOpenChat = (member: BoardMember) => {
    setChatMember(member);
    if (!chatMessages[member.id]) {
      setChatMessages((prev) => ({
        ...prev,
        [member.id]: [
          {
            id: `sys-${Date.now()}`,
            sender: 'system',
            text: `Connected to demo chat thread with ${member.name} (${member.title}).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    }
  };

  // Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatMember) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [chatMember.id]: [...(prev[chatMember.id] || []), newMsg],
    }));

    setInputText('');
  };

  const getCategoryBadgeLabel = (cat: 'officers' | 'directors' | 'advisers') => {
    switch (cat) {
      case 'officers':
        return 'Board Officer';
      case 'directors':
        return 'Board Director';
      case 'advisers':
        return 'Board Adviser';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30 font-montserrat font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Authentic Roster • 24 Verified Members
            </span>
            <span className="text-xs text-[#CBD5E1] font-sans flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified Board Roster
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
            RCM Member Directory
          </h2>
          <p className="text-xs text-[#CBD5E1] mt-1 max-w-2xl leading-relaxed">
            Exclusively displaying verified officers, directors, and advisers of the Rotary Club of Makati. Incomplete bio or photo records display honest placeholders per data integrity guidelines.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member name or title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[#F8FAFC] text-xs font-sans transition-all focus:outline-none focus:ring-2 focus:ring-[#17458F] focus:border-white/20 placeholder-[#94A3B8]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs by Tier */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Members (24)', count: 24 },
          { id: 'officers', label: 'Officers (7)', count: 7 },
          { id: 'directors', label: 'Directors (9)', count: 9 },
          { id: 'advisers', label: 'Advisers (8)', count: 8 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              selectedCategory === tab.id
                ? 'bg-[#17458F] text-white border-white/20 shadow-md'
                : 'bg-white/5 border-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-[16px] p-5 transition-all duration-300 hover:shadow-xl hover:border-[#F7A81B]/40 hover:-translate-y-1 flex flex-col justify-between space-y-4 group relative"
          >
            {/* Top Card Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30 font-montserrat font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                  {getCategoryBadgeLabel(member.category)}
                </span>
                <span className="inline-flex items-center space-x-1 text-[10px] font-montserrat font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Shield className="w-3 h-3" />
                  <span>Board</span>
                </span>
              </div>

              {/* Photo & Name */}
              <div className="flex items-center space-x-3 pt-1">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#F7A81B] shrink-0 bg-black/40 shadow-sm">
                  <ImageWithFallback
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base leading-snug text-[#F8FAFC]">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#F7A81B] mt-0.5">
                    {member.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Card Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedMember(member)}
                className="text-xs font-montserrat font-bold underline transition-colors text-[#CBD5E1] hover:text-[#F8FAFC]"
              >
                View Profile
              </button>

              <button
                type="button"
                onClick={() => handleOpenChat(member)}
                className="bg-[#17458F] hover:bg-[#123773] text-white px-3.5 py-1.5 rounded-xl font-montserrat font-bold text-xs shadow-md border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-105"
              >
                <MessageSquare className="w-3.5 h-3.5 text-white" />
                <span>Message</span>
              </button>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5 space-y-2">
            <Search className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <p className="font-serif font-bold text-base text-[#F8FAFC]">
              No matching members found
            </p>
            <p className="text-xs text-[#CBD5E1]">
              Try searching with another name or title keyword.
            </p>
          </div>
        )}
      </div>

      {/* MEMBER PROFILE MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] shadow-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#F7A81B]" />
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#F7A81B]">
                  Verified Board Member Profile
                </span>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-full hover:bg-white/10 text-[#F7A81B] border border-[#F7A81B]/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-[#F7A81B] mx-auto shadow-md">
                <ImageWithFallback
                  src={selectedMember.photoUrl}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <h3 className="font-serif font-extrabold text-xl text-[#F8FAFC]">
                  {selectedMember.name}
                </h3>
                <p className="text-sm font-bold text-[#F7A81B] mt-1">
                  {selectedMember.title}
                </p>
                <span className="inline-block mt-2 bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30 text-[10px] font-montserrat font-bold uppercase px-3 py-0.5 rounded-full">
                  {getCategoryBadgeLabel(selectedMember.category)} • Rotary Club of Makati
                </span>
              </div>
            </div>

            {/* Honest Data Integrity Placeholders */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
              <div className="flex items-start space-x-2 text-[#CBD5E1]">
                <Info className="w-4 h-4 text-[#F7A81B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[#F8FAFC]">Official Profile Summary</span>
                  <p className="opacity-90 leading-relaxed text-[11px] mt-0.5">
                    Bio coming soon — profile records currently being verified with the RCM Secretariat per data integrity protocol.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 text-[11px] text-[#94A3B8]">
                Contact information available upon request through official Secretariat channels.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] font-montserrat font-bold text-xs uppercase"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const m = selectedMember;
                  setSelectedMember(null);
                  handleOpenChat(m);
                }}
                className="bg-[#17458F] hover:bg-[#123773] text-white px-5 py-2.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider shadow border border-white/20 flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Message Member</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT PANEL / MODAL */}
      {chatMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-[18px] border border-white/10 bg-[#0F172A] text-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col h-[580px]">
            {/* Chat Top Header */}
            <div className="p-4 border-b border-white/10 bg-[#16233B] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#F7A81B] bg-black/40 shrink-0">
                  <ImageWithFallback
                    src={chatMember.photoUrl}
                    alt={chatMember.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#F8FAFC]">
                    {chatMember.name}
                  </h3>
                  <p className="text-[11px] text-[#F7A81B] font-semibold">
                    {chatMember.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-montserrat font-bold uppercase px-2.5 py-0.5 rounded-full">
                  Available
                </span>
                <button
                  onClick={() => setChatMember(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-[#F7A81B] border border-[#F7A81B]/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Demo Notice Banner */}
            <div className="p-2.5 bg-[#F7A81B]/15 border-b border-[#F7A81B]/30 text-[11px] font-sans text-[#F7A81B] px-4 flex items-center space-x-2 shrink-0">
              <Info className="w-4 h-4 shrink-0 text-[#F7A81B]" />
              <span>Demo messaging — not connected to a real server yet.</span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0A0F1D]/80">
              {(chatMessages[chatMember.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-[#17458F] text-white rounded-br-none shadow border border-white/20'
                        : 'bg-white/10 text-[#F8FAFC] border border-white/10 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[9px] block text-right font-mono opacity-70 text-[#CBD5E1]">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#16233B] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type message to ${chatMember.name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#17458F] placeholder-[#94A3B8]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-[#17458F] hover:bg-[#123773] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-montserrat font-bold text-xs uppercase shadow border border-white/20 flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
