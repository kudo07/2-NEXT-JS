import React, { useEffect, useRef, useState } from 'react';

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-2">
    <span className="text-gray-500">Typing</span>
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
  </div>
);
const Message = ({ message }) => {
  const isMe = message.sender === 'me';
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl transition-all duration-300 ${
          isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p>{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            isMe ? 'text-blue-100' : 'text-gray-500'
          } text-right`}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};
const ChatWindow = ({
  contact,
  messages,
  onSendMessage,
  toggleSidebar,
  isTyping,
}) => {
  const [inputText, setInputText] = useState('');
  const messageEndRef = useRef(null);
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, istyping]);

  const handleSend = () => {
    if (inputText.trim()) {
      // send the message to chat layout handleSendMEsage
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
      <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
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
          <p className="text-sm text-green-500">Online</p>
        </div>
      </div>
      <div className="flex-grow p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messageEndRef} />
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
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={!inputText.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
