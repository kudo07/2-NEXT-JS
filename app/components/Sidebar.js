import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Avatar = ({ initial, online }) => (
  <div className="relative flex-shrink-0">
    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
      {initial}
    </div>
    {online && (
      <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-400 border-2 border-white"></span>
    )}
  </div>
);

const Contact = ({ contact, onSelectContact, isSelected }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg ${
      isSelected ? 'bg-blue-100' : ''
    }`}
    onClick={() => onSelectContact(contact)}
  >
    <Avatar initial={contact.avatar} online={contact.online} />
    <div className="ml-4 flex-grow overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold truncate">{contact.name}</h3>
        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
          {contact.timestamp}
        </p>
      </div>
      <div className="flex justify-between items-center mt-1">
        <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
        {contact.unread > 0 && (
          <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
            {contact.unread}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export default function Sidebar({
  contacts,
  onSelectContact,
  selectedContact,
  isOpen,
  setIsOpen,
}) {
  const sidebarVariants = {
    open: {
      width: 384,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      width: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30, delay: 0.1 },
    },
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const content = (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chats</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-2">
        <div className="flex flex-col space-y-1">
          {contacts.map((contact) => (
            <Contact
              key={contact.id}
              contact={contact}
              onSelectContact={onSelectContact}
              isSelected={selectedContact && contact.id === selectedContact.id}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="overflow-hidden hidden md:block flex-shrink-0"
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      >
        <div className="w-96 h-full">{content}</div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              className="absolute top-0 left-0 h-full w-5/6 max-w-sm bg-white"
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
