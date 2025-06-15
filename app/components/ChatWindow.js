import { useState, useEffect, useRef } from 'react';
import { Send, Menu, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center space-x-1 p-2 self-start"
  >
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </motion.div>
);

const MessageStatus = ({ status }) => {
  if (status === 'sent') {
    return <Check size={16} className="text-blue-200" />;
  }
  if (status === 'delivered') {
    return <CheckCheck size={16} className="text-blue-200" />;
  }
  return null;
};

const Message = ({ message }) => {
  const isMe = message.sender === 'me';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
          isMe ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="break-words">{message.text || '...'}</p>
        <div className="flex items-center justify-end space-x-2 mt-1">
          <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp}
          </p>
          {isMe && <MessageStatus status={message.status} />}
        </div>
      </div>
    </motion.div>
  );
};

export default function ChatWindow({
  contact,
  messages,
  onSendMessage,
  toggleSidebar,
  isTyping,
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!contact) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50 z-10">
        <button
          onClick={toggleSidebar}
          className="md:hidden mr-4 text-gray-600"
        >
          <Menu size={24} />
        </button>
        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
          {contact.avatar}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{contact.name}</h3>
          {contact.online && <p className="text-sm text-green-500">Online</p>}
        </div>
      </div>
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow focus:outline-none bg-transparent"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            disabled={!inputText.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
