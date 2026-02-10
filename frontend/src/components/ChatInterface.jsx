import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send, User, Bot, Paperclip, Mic, ArrowUp, Trash2 } from 'lucide-react';
import { suggestedPrompts } from '../utils/mockData';
import { chatService } from '../api/services/chat_service';

// Helper to render text with clickable links
const renderMessageWithLinks = (text) => {
  if (!text || typeof text !== 'string') return text;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline break-all"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};

const ChatInterface = (props) => {
  const [messages, setMessages] = useState([]);
  const displayMessages = props.messages || messages;
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Load conversation from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('almatiq_conversation');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('almatiq_conversation', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, isTyping]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        console.log('Speech recognition result:', transcript);
        // Optionally send message immediately after recognition
        // handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);

        // Explain common errors to user
        if (event.error === 'not-allowed') {
          alert("Microphone access denied. Please allow microphone permissions in your browser settings.");
        } else if (event.error === 'no-speech') {
          // Ignore no-speech, just stop listening
        } else if (event.error === 'network') {
          alert("Network error. Voice recognition requires an internet connection.");
        } else {
          alert(`Voice Error: ${event.error}`);
        }
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Try using Chrome or Edge.');
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (e) {
      console.error("Error toggling speech:", e);
    }
  };

  const handleSendMessage = async (textOverride = null) => {
    const userMessage = textOverride || inputValue.trim();
    if (!userMessage) return;

    if (props.onSendMessage) {
      props.onSendMessage(userMessage);
      setInputValue('');
      setIsTyping(false);
      return;
    }

    setError(null);

    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const data = await chatService.sendMessage(userMessage, conversationId);

      const botMessage = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'bot',
        timestamp: data.timestamp
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = {
        id: Date.now() + 1,
        text: err.response?.data?.detail || "I'm having trouble connecting right now.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearMessages = () => {
    if (window.confirm("Are you sure you want to clear the conversation?")) {
      setMessages([]);
      setError(null);
      localStorage.removeItem('almatiq_conversation');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white relative font-sans">

      {/* Clear Chat Button */}
      {displayMessages.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearMessages}
          className="absolute top-2 left-4 z-10 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg p-2 transition-colors h-8 w-8"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {displayMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-0 animate-in fade-in duration-700 fill-mode-forwards" style={{ animationDelay: '200ms', opacity: 1 }}>
            <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6 ring-1 ring-white/10">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Kaira</h1>
            <h3 className="text-lg font-medium text-zinc-400 mb-2">How can I help you recover?</h3>
            <p className="text-zinc-500 max-w-md mb-8">
              Ask me about muscle recovery, booking sessions, or our AI technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-4 py-3 text-sm text-left bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-zinc-400" />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] space-y-1 ${message.sender === 'user' ? 'items-end flex flex-col' : 'items-start'}`}>
                  <div
                    className={`px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap ${message.sender === 'user'
                      ? 'bg-white text-black rounded-tr-sm'
                      : 'bg-zinc-800/50 text-gray-200 border border-zinc-700/50 rounded-tl-sm'
                      } ${message.isError ? 'bg-red-900/20 text-red-200 border-red-800/50' : ''}`}
                  >
                    {renderMessageWithLinks(message.text)}
                  </div>
                  <span className="text-xs text-zinc-600 px-1">
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#09090b]">
        {error && (
          <div className="mb-3 px-4 py-2 bg-red-900/20 border border-red-800/50 text-red-300 rounded-lg text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {error}
          </div>
        )}

        <div className="relative bg-[#18181b] border border-zinc-800 rounded-xl focus-within:ring-1 focus-within:ring-zinc-600 transition-all shadow-xl">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white placeholder-zinc-500 p-4 min-h-[60px] max-h-[200px] resize-none focus:outline-none text-base scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent rounded-xl"
            placeholder="Ask Kaira anything..."
            rows={1}
          />

          <div className="flex justify-between items-center px-3 pb-3 pt-1">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-lg transition-all duration-200 cursor-pointer ${isListening
                  ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                onClick={toggleListening}
                title="Use Voice Input"
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>
            </div>

            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className={`rounded-lg transition-all duration-200 h-8 px-3 ${inputValue.trim()
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-3">
          <p className="text-[10px] sm:text-xs text-zinc-600">
            AI-powered assistant. Messages may be monitored for quality assurance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
