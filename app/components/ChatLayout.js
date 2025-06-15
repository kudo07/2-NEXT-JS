'use client';

import React, { useEffect, useState } from 'react';
import { contacts, initialMessages } from '../data/contact';
import { computeFromManifest } from 'next/dist/build/utils';

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
  const handleSendMessage = async (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const currentContactMessages = messages[selectedContact.id] || [];
    //
    const upatededMessages = [...currentContactMessages, newMessage];
    //
    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedContact.id]: upatededMessages,
    }));
    // {1:{
    //   id:1,
    //   messages,
    // },{2:id:2,message}, newMessage}
    setIsTyping(true);
    // wants to format into api for the gemini
    // gemini sets the format [{role:'user',parts:"hello"}]
    // gemini expects this message
    const history = (messages[selectedContact.id] || []).map((msg) => ({
      role: msg.sender === 'me' ? 'user' : 'model',
      parts: msg.text,
    }));
    try {
      const response = await fetch('api/fetch/strean', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.history }),
      });
      if (!response.body) return;
      setIsTyping(false);
      // i have to read the chunks here and display in the ui
      // like  .json() get the whole data bu here i am using stream for chunking and display real time appending text
      // in the ui
      // give the chunks http response instead waiting for the whole response
      // get data piece by piecce
      const reader = response.body.getReader();
      //converts binary data into the string
      const decoder = new TextDecoder();
      //ascii or utf-8
      let botMessageText = '';
      const botMessageId = Date.now() + 1;

      // add a placeholder for bot's mesage
      // when i type so ot replies with text and that the timestamp
      const botMessagePlaceholder = {
        id: botMessageId,
        text: '.......',
        sender: 'them',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      // add the bot replies under that specific id
      // when i click the id 1 for chat then when i reply then the bot reply
      // that replies is adding in that particular id with the replies and bot replies with the id
      // so from intial messages to the new mesages in that id
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedContact.id]: [...upatededMessages, botMessagePlaceholder],
      }));
      //keep adding the bot messages and display with that particular id chatting
      while (true) {
        const { value, done } = await reader.read();
        // await for value
        // value  is utf-8 acii harray for the text
        if (done) {
          break;
        }
        // append chunks piece by -2
        botMessageText += decoder.decode(value, { stream: true });
        // converts the ascii array into the string text which was typed
        // previously i add the placeholder for the bot reply
        // now bot is replying chunk by chunk from decoder and update the placeholder message witht he growing text
        // i want to add the message chunk in that placehlder from the messagges for that particular id
        setMessages((prevMessages) => {
          // mutate with the new state
          // select the previous messages for that id selected
          const newContactMessages = [...prevMessages[selectedContact.id]];
          // select that placeholder which we add previously
          const botMessageIndex = newContactMessages.findIndex(
            (m) => m.id === botMessageId
          );
          // if not found add the text with start chunk as botMessageText
          if (botMessageIndex == -1) {
            newContactMessages[botMessageIndex] = {
              ...newContactMessages[botMessageIndex],
              text: botMessageText,
            };
          }
          return {
            // return the updated meesage object
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
      <Sidebar />
      <div className="flex flex-col flex-grow"></div>
    </div>
  );
};

export default ChatLayout;
