import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContent from '../components/layout/MainContent';
import * as friendApi from '../services/friendApi';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // ---- Determine active tab & sub‑tab from URL ----
  const path = location.pathname;
  let activeTab: 'chat' | 'friends' = 'chat';
  let subTab: 'home' | 'friends' | 'requests' | 'suggestions' = 'home';

  if (path.startsWith('/chat')) {
    activeTab = 'chat';
  } else if (path.startsWith('/friends')) {
    activeTab = 'friends';
    if (path === '/friends/home') {
      subTab = 'home';
    } else if (path === '/friends/all-friends') {
      subTab = 'friends';
    } else if (path.includes('/requests')) {
      subTab = 'requests';
    } else if (path.includes('/suggestions')) {
      subTab = 'suggestions';
    } else if (path === '/friends') {
      navigate('/friends/home', { replace: true });
      subTab = 'home';
    } else {
      subTab = 'home';
    }
  } else {
    navigate('/chat', { replace: true });
    activeTab = 'chat';
  }

  // ---- State ----
  const [allUsers, setAllUsers] = useState<friendApi.Friend[]>([]);
  const [homeSummary, setHomeSummary] = useState<friendApi.HomeSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // ---- Fetch data when subTab changes ----
  useEffect(() => {
    if (activeTab !== 'friends') return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (subTab === 'home') {
          const res = await friendApi.getHomeSummary();
          setHomeSummary(res.data);
          setAllUsers([]); // not used on home
        } else {
          let response;
          switch (subTab) {
            case 'friends':
              response = await friendApi.getConnectedFriends(page);
              break;
            case 'requests':
              response = await friendApi.getPendingRequests(page);
              break;
            case 'suggestions':
              response = await friendApi.getSuggestions(page);
              break;
            default:
              return;
          }
          // If page === 0, replace; else append
          if (page === 0) {
            setAllUsers(response.data.content);
          } else {
            setAllUsers(prev => [...prev, ...response.data.content]);
          }
          setHasMore(!response.data.last);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load friends');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, subTab, page]);

  // ---- Handlers for actions ----
  const handleConnect = async (friendId: string) => {
    try {
      await friendApi.sendConnectRequest(friendId);
      alert('Friend request sent!');
      // Optionally refetch suggestions
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      await friendApi.acceptRequest(connectionId);
      alert('Request accepted!');
      // Refetch pending and connected
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept');
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
    try {
      await friendApi.declineRequest(connectionId);
      alert('Request declined');
      // Refetch pending
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to decline');
    }
  };

  const handleMessageFriend = (friendId: string) => {
    // Navigate to chat with that friend
    navigate(`/chat/${friendId}`);
  };

  // ---- Sidebar click handler ----
  const handleSetActiveTab = (tab: string) => {
    if (tab === 'chat') navigate('/chat');
    else if (tab === 'friends') navigate('/friends/home');
  };

  // ---- Sub‑tab click handler ----
  const handleSubTabChange = (tab: 'home' | 'friends' | 'requests' | 'suggestions') => {
    setPage(0); // reset pagination
    let path = '';
    if (tab === 'home') path = '/friends/home';
    else if (tab === 'friends') path = '/friends/all-friends';
    else if (tab === 'requests') path = '/friends/requests';
    else if (tab === 'suggestions') path = '/friends/suggestions';
    navigate(path);
  };

  // ---- Load more ----
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  // ---- Loading / error ----
  if (loading && page === 0) {
    return <div className="d-flex justify-content-center align-items-center h-100">Loading...</div>;
  }
  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div className="d-flex overflow-hidden" style={{ height: '100vh', width: '100vw' }}>
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      <div className="d-flex flex-column flex-grow-1" style={{ height: '100vh' }}>
        <Topbar activeTab={activeTab} subTab={subTab} />
        <MainContent
          activeTab={activeTab}
          contacts={[]} // TODO: fetch real contacts for chat
          allUsers={allUsers}
          homeSummary={homeSummary}
          onConnect={handleConnect}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
          onMessageFriend={handleMessageFriend}
          subTab={subTab}
          onSubTabChange={handleSubTabChange}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}