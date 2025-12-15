import React, { useState, useRef, useEffect } from 'react';
import { createChatSession, ChatMessage } from '../services/chatService';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, Sparkles, ShieldAlert } from 'lucide-react';
import { Chat, GenerateContentResponse } from '@google/genai';

interface ChatWidgetProps {}

export const ChatWidget: React.FC<ChatWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'es-US'>('en-US');
  // Removed audioEnabled state as auto-play is disabled

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Chat
  useEffect(() => {
    try {
      const session = createChatSession();
      setChatSession(session);
      
      // Initial greeting
      setMessages([{
        role: 'model',
        text: "Hi! I'm the Pujol Law Assistant. I can explain Florida estate planning concepts like Trusts, Wills, and Lady Bird Deeds. How can I help you today?"
      }]);
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Update recognition language when state changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Microphone not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a voice matching the language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (voice) utterance.voice = voice;
    
    utterance.lang = language;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    // Ensure session exists
    let activeSession = chatSession;
    if (!activeSession) {
      try {
        activeSession = createChatSession();
        setChatSession(activeSession);
      } catch (e) {
        console.error("Failed to recover chat session", e);
        setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the service. Please check your internet or try again later." }]);
        return;
      }
    }

    // Add User Message
    const newMessages = [...messages, { role: 'user', text: textToSend } as ChatMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response: GenerateContentResponse = await activeSession.sendMessage({ message: textToSend });
      const responseText = response.text;
      
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        // Removed auto-speak call here to comply with strict UX rules
      } else {
        throw new Error("Empty response received");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again or contact the office directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { label: "Revocable Living Trust", text: "What is a Revocable Living Trust in Florida?" },
    { label: "Lady Bird Deed", text: "How does a Lady Bird Deed work?" },
    { label: "Probate", text: "Why should I avoid probate?" },
    { label: "Power of Attorney", text: "Do I need a Power of Attorney?" },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-pujol-blue text-white px-5 py-3 rounded-full shadow-xl hover:bg-pujol-teal transition-transform hover:scale-105 active:scale-95 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
        <span className="font-semibold">Ask Pujol Law</span>
      </button>

      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] h-[100dvh] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col border border-pujol-silver/50 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Header */}
          <div className="bg-pujol-navy text-white p-4 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                <Sparkles size={16} className="text-pujol-sky" />
                Pujol Law Assistant
              </h3>
              <p className="text-xs text-slate-300">Educational Assistant • Not Legal Advice</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-amber-50 p-2 text-xs text-amber-800 text-center border-b border-amber-100 font-medium flex items-center justify-center gap-1 shrink-0">
            <ShieldAlert size={12} />
            <span>AI Generated. Verify details with Attorney Joe Pujol.</span>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-pujol-light/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div 
                    className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-pujol-blue text-white rounded-2xl rounded-br-none' 
                        : 'bg-white text-pujol-navy border border-pujol-silver/30 rounded-2xl rounded-bl-none'
                    }`}
                  >
                    {/* Render bold text simply */}
                    {msg.text.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>
                  
                  {/* Manual Audio Button for Model Messages */}
                  {msg.role === 'model' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="mt-1 ml-1 text-slate-400 hover:text-pujol-blue p-1 rounded-full hover:bg-slate-100 transition-colors"
                      title="Read out loud"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-pujol-silver/30 shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-white border-t border-pujol-silver/30 overflow-x-auto whitespace-nowrap scrollbar-hide shrink-0">
            <div className="flex gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.text)}
                  className="px-3 py-1.5 bg-pujol-light/50 hover:bg-pujol-blue/10 text-slate-600 hover:text-pujol-blue text-xs font-medium rounded-full transition-colors border border-pujol-silver/50"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-pujol-silver/30 shrink-0">
            <div className="flex items-center gap-2 mb-2">
               <div className="flex bg-pujol-light/50 rounded-lg p-0.5">
                  <button 
                    onClick={() => setLanguage('en-US')}
                    className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${language === 'en-US' ? 'bg-white text-pujol-blue shadow-sm' : 'text-slate-500'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('es-US')}
                    className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${language === 'es-US' ? 'bg-white text-pujol-teal shadow-sm' : 'text-slate-500'}`}
                  >
                    Español
                  </button>
               </div>
               <span className="text-xs text-slate-400 ml-auto">
                 {isListening ? 'Listening...' : ''}
               </span>
            </div>
            
            <div className="relative flex items-end gap-2">
              <div className="relative flex-grow">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={language === 'en-US' ? "Ask a question..." : "Haga una pregunta..."}
                  className="w-full bg-slate-50 border border-pujol-silver/50 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pujol-blue/20 focus:border-pujol-blue resize-none max-h-32 min-h-[46px]"
                  rows={1}
                />
                <button
                  onClick={toggleMic}
                  className={`absolute right-2 bottom-2 p-1.5 rounded-full transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:text-pujol-blue hover:bg-pujol-blue/10'}`}
                  title="Speak"
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isLoading}
                className="bg-pujol-blue text-white p-3 rounded-xl hover:bg-pujol-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};