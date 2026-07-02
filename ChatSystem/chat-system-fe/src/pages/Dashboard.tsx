import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContent from '../components/layout/MainContent';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('chat');

  // 👇 LIST A: People I am ALREADY friends with (Shows in Chat tab)
  const myContacts = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', online: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', online: false },
  ];

  // 👇 LIST B: ALL registered users on the system (Shows in Friends/Connect tab)
  // Notice Charlie is here but NOT in myContacts - so we can "Connect" with him.
  const allUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', online: true }, // Already friend
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', online: false },     // Already friend
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', online: true }, // Not a friend yet!
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', online: false },   // Not a friend yet!
  ];

  const handleConnect = (friendId: any) => {
    alert(`Sending connect request to user ID: ${friendId}`);
    // Later, this will send a POST request to your backend.
    // If accepted, this user will move from 'allUsers' to 'myContacts'!
  };

  return (
    <div 
      className="d-flex overflow-hidden" 
      style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="d-flex flex-column flex-grow-1" style={{ height: '100vh' }}>
        <Topbar activeTab={activeTab} />
        <MainContent 
          activeTab={activeTab} 
          contacts={myContacts}       // 👈 Pass existing friends to Chat
          allUsers={allUsers}         // 👈 Pass all users to Find Friends
          onConnect={handleConnect} 
        />
      </div>
    </div>
  );
}