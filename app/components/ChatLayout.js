'use client';

import React, { useEffect, useState } from 'react';
import { contacts, initialMessages } from '../data/contact';

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSideBarOpen(false);
    }
  }, [selectedContact]);

  //
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };
  const handleSendMessage = async (text) => {};
  return <div></div>;
};

export default ChatLayout;
