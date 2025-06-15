'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { contacts, initialMessages } from '../data/contact';
export default function ChatLayout() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(() => {
    const initializedMessages = {};
    for (const contactId in initialMessages) {
      initializedMessages[contactId] = initialMessages[contactId].map(
        (msg) => ({ ...msg, status: 'delivered' })
      );
    }
    return initializedMessages;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768 && selectedContact) {
      setSidebarOpen(false);
    }
  }, [selectedContact]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = async (text) => {
    const newMessageId = Date.now();
    const newMessage = {
      id: newMessageId,
      text,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
    };

    const currentContactMessages = messages[selectedContact.id] || [];
    const updatedMessages = [...currentContactMessages, newMessage];

    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedContact.id]: updatedMessages,
    }));

    setTimeout(() => {
      setMessages((prevMessages) => {
        const newContactMessages = (prevMessages[selectedContact.id] || []).map(
          (m) => (m.id === newMessageId ? { ...m, status: 'delivered' } : m)
        );
        return {
          ...prevMessages,
          [selectedContact.id]: newContactMessages,
        };
      });
    }, 1000);

    setIsTyping(true);

    let history = (messages[selectedContact.id] || []).map((msg) => ({
      role: msg.sender === 'me' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // FIX: The Gemini API requires history to start with a 'user' role.
    // This ensures we trim any leading 'model' messages from the history.
    const firstUserIndex = history.findIndex((h) => h.role === 'user');
    if (firstUserIndex > 0) {
      history = history.slice(firstUserIndex);
    } else if (firstUserIndex === -1 && history.length > 0) {
      history = [];
    }

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.body) return;
      setIsTyping(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessageText = '';
      const botMessageId = Date.now() + 1;

      const botMessagePlaceholder = {
        id: botMessageId,
        text: '',
        sender: 'them',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'received',
      };

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedContact.id]: [
          ...(prevMessages[selectedContact.id] || []),
          botMessagePlaceholder,
        ],
      }));

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        botMessageText += decoder.decode(value, { stream: true });

        setMessages((prevMessages) => {
          const newContactMessages = [...prevMessages[selectedContact.id]];
          const botMessageIndex = newContactMessages.findIndex(
            (m) => m.id === botMessageId
          );
          if (botMessageIndex !== -1) {
            newContactMessages[botMessageIndex] = {
              ...newContactMessages[botMessageIndex],
              text: botMessageText,
            };
          }
          return {
            ...prevMessages,
            [selectedContact.id]: newContactMessages,
          };
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, something went wrong. Please check your API key.',
        sender: 'them',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'error',
      };
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedContact.id]: [...updatedMessages, errorMessage],
      }));
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800">
      <Sidebar
        contacts={contacts}
        onSelectContact={handleSelectContact}
        selectedContact={selectedContact}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex flex-col flex-grow min-w-0">
        <ChatWindow
          contact={selectedContact}
          messages={messages[selectedContact.id] || []}
          onSendMessage={handleSendMessage}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}
