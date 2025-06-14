export const contacts = [
  {
    id: 1,
    name: 'Emma Thompson',
    avatar: 'ET',
    lastMessage: "I've just sent it to your email.",
    timestamp: '12:45 PM',
    unread: 0,
    online: true,
  },
  {
    id: 2,
    name: 'Michael Johnson',
    avatar: 'MJ',
    lastMessage: 'Are we still meeting for coffee?',
    timestamp: 'Yesterday',
    unread: 2,
    online: false,
  },
  {
    id: 3,
    name: 'Sophia Lee',
    avatar: 'SL',
    lastMessage: 'The design team loved your proposal!',
    timestamp: 'Yesterday',
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: 'Robert Brown',
    avatar: 'RB',
    lastMessage: 'Can you review the budget proposal?',
    timestamp: 'Tuesday',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: 'Amelia Wilson',
    avatar: 'AW',
    lastMessage: 'Thanks for your help with the slides.',
    timestamp: 'Monday',
    unread: 0,
    online: false,
  },
  {
    id: 6,
    name: 'Daniel Martinez',
    avatar: 'DM',
    lastMessage: "Let's schedule a call to discuss.",
    timestamp: 'May 27',
    unread: 0,
    online: true,
  },
];

export const initialMessages = {
  1: [
    {
      id: 1,
      text: "Hey there! How's it going?",
      sender: 'them',
      timestamp: '12:00 PM',
    },
    {
      id: 2,
      text: "I'm doing great, thanks for asking!",
      sender: 'me',
      timestamp: '12:01 PM',
    },
    {
      id: 3,
      text: "Oh, I almost forgot - do you have the latest version of the client presentation? I want to make sure we're all on the same page for tomorrow.",
      sender: 'them',
      timestamp: '12:05 PM',
    },
    {
      id: 4,
      text: "I've just sent it to your email. It includes all the updates we discussed in the last meeting. Let me know if you need anything else!",
      sender: 'me',
      timestamp: '12:15 PM',
    },
    {
      id: 5,
      text: "Got it, thanks! I'll review it before our lunch. See you soon!",
      sender: 'them',
      timestamp: '12:20 PM',
    },
    {
      id: 6,
      text: 'Looking forward to it! 👍',
      sender: 'me',
      timestamp: '12:21 PM',
    },
  ],
  2: [
    {
      id: 1,
      text: 'Are we still meeting for coffee?',
      sender: 'them',
      timestamp: 'Yesterday',
    },
    {
      id: 2,
      text: 'Yes, absolutely! 3 PM at the usual spot?',
      sender: 'me',
      timestamp: 'Yesterday',
    },
  ],
  // Add more initial messages for other contacts if needed
};
