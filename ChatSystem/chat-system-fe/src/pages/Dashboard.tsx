import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContent from '../components/layout/MainContent';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // ---- Determine active tab & sub‑tab from URL ----
  const path = location.pathname;
  let activeTab: 'chat' | 'friends' = 'chat';
  let subTab: 'friends' | 'requests' | 'suggestions' = 'friends';

  if (path.startsWith('/chat')) {
    activeTab = 'chat';
  } else if (path.startsWith('/friends')) {
    activeTab = 'friends';
    if (path.includes('/suggestions')) subTab = 'suggestions';
    else if (path.includes('/requests')) subTab = 'requests';
    else subTab = 'friends';
  } else {
    // fallback – redirect to chat
    navigate('/chat', { replace: true });
    activeTab = 'chat';
  }

  // ---- Sidebar click handler ----
  const handleSetActiveTab = (tab: string) => {
    if (tab === 'chat') navigate('/chat');
    else if (tab === 'friends') navigate('/friends');
  };

  // ---- Sub‑tab click handler (inside FriendsView) ----
  const handleSubTabChange = (tab: 'friends' | 'requests' | 'suggestions') => {
    let path = '/friends';
    if (tab === 'suggestions') path = '/friends/suggestions';
    else if (tab === 'requests') path = '/friends/requests';
    navigate(path);
  };

  // ---- Static data (replace with real API later) ----
  const myContacts = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', online: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', online: false },
  ];
  const pendingRequests = [
    { id: 5, name: 'Eve Adams', email: 'eve@example.com', online: true },
  ];
  const allUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', online: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', online: false },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', online: true },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', online: false },
    { id: 5, name: 'Eve Adams', email: 'eve@example.com', online: true },
  ];

  const allUsersWithStatus = allUsers.map(user => {
    if (myContacts.some(c => c.id === user.id)) {
      return { ...user, status: 'connected' as const };
    } else if (pendingRequests.some(p => p.id === user.id)) {
      return { ...user, status: 'pending' as const };
    } else {
      return { ...user, status: 'suggested' as const };
    }
  });

  // ---- Handlers for actions ----
  const handleConnect = (friendId: number) => {
    alert(`Sending connect request to user ID: ${friendId}`);
  };
  const handleAcceptRequest = (friendId: number) => {
    alert(`Accepting friend request from user ID: ${friendId}`);
  };
  const handleDeclineRequest = (friendId: number) => {
    alert(`Declining friend request from user ID: ${friendId}`);
  };
  const handleMessageFriend = (friendId: number) => {
    alert(`Opening chat with user ID: ${friendId}`);
  };

  return (
    <div
      className="d-flex overflow-hidden"
      style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      <div className="d-flex flex-column flex-grow-1" style={{ height: '100vh' }}>
        <Topbar activeTab={activeTab} />
        <MainContent
          activeTab={activeTab}
          contacts={myContacts}
          allUsers={allUsersWithStatus}
          onConnect={handleConnect}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
          onMessageFriend={handleMessageFriend}
          subTab={subTab}
          onSubTabChange={handleSubTabChange}
        />
      </div>
    </div>
  );
}