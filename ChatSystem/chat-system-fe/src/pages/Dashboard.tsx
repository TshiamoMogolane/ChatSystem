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

  // 👇 LIST B: Pending friend requests (sent by others to me)
  const pendingRequests = [
    { id: 5, name: 'Eve Adams', email: 'eve@example.com', online: true },
  ];

  // 👇 LIST C: ALL registered users on the system (including friends and pending)
  // We'll combine them and assign status.
  const allUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', online: true }, // Already friend
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', online: false },      // Already friend
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', online: true }, // Not a friend (suggestion)
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', online: false },   // Not a friend (suggestion)
    { id: 5, name: 'Eve Adams', email: 'eve@example.com', online: true },         // Has sent a request (pending)
  ];

  // Build the combined list with status
  const allUsersWithStatus = allUsers.map(user => {
    if (myContacts.some(c => c.id === user.id)) {
      return { ...user, status: 'connected' as const };
    } else if (pendingRequests.some(p => p.id === user.id)) {
      return { ...user, status: 'pending' as const };
    } else {
      return { ...user, status: 'suggested' as const };
    }
  });

  // Handlers
  const handleConnect = (friendId: number) => {
    alert(`Sending connect request to user ID: ${friendId}`);
    // Later: POST /api/friend-requests
  };

  const handleAcceptRequest = (friendId: number) => {
    alert(`Accepting friend request from user ID: ${friendId}`);
    // Later: POST /api/friend-requests/accept
  };

  const handleDeclineRequest = (friendId: number) => {
    alert(`Declining friend request from user ID: ${friendId}`);
    // Later: POST /api/friend-requests/decline
  };

  const handleMessageFriend = (friendId: number) => {
    alert(`Opening chat with user ID: ${friendId}`);
    // Later: navigate to chat or open a chat window
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
          contacts={myContacts}                      // for ChatView
          allUsers={allUsersWithStatus}             // for FriendsView (with status)
          onConnect={handleConnect}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
          onMessageFriend={handleMessageFriend}
        />
      </div>
    </div>
  );
}