import { useState, useEffect, useRef } from 'react';
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

  // ---- Notification state ----
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // ---- Loading & requested states for Connect button ----
  const [loadingFriendIds, setLoadingFriendIds] = useState<Set<string>>(new Set());
  const [requestedFriendIds, setRequestedFriendIds] = useState<Set<string>>(new Set());

  // Ref for timeout to clear on unmount
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto‑dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  // ---- Helper to get friend name by ID ----
  const getFriendName = (friendId: string): string => {
    // Search in allUsers (used for paginated tabs)
    const fromAll = allUsers.find(f => f.id === friendId);
    if (fromAll) return fromAll.name;

    // Search in homeSummary suggestions (home tab)
    if (homeSummary) {
      const fromSuggestions = homeSummary.suggestions.find(f => f.id === friendId);
      if (fromSuggestions) return fromSuggestions.name;
      // Also check pending (though not needed for connect)
      const fromPending = homeSummary.pending.find(f => f.id === friendId);
      if (fromPending) return fromPending.name;
    }
    return 'user'; // fallback
  };

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
          setAllUsers([]);
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
    // Get friend name for personalized notification
    const friendName = getFriendName(friendId);

    // Set loading for this friend
    setLoadingFriendIds(prev => new Set(prev).add(friendId));
    try {
      await friendApi.sendConnectRequest(friendId);
      showNotification(`Friend request sent to ${friendName}!`, 'success');
      // Mark as requested so the button shows "Sent"
      setRequestedFriendIds(prev => new Set(prev).add(friendId));

      // Clear any existing timeout
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
        refetchTimeoutRef.current = null;
      }

      // Delay refetch to allow "Sent" to be visible for 1.5 seconds
      refetchTimeoutRef.current = setTimeout(() => {
        if (subTab === 'suggestions') {
          setPage(0);
        } else if (subTab === 'home') {
          friendApi.getHomeSummary().then(res => setHomeSummary(res.data));
        }
        refetchTimeoutRef.current = null;
      }, 1500);
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to send request', 'error');
    } finally {
      // Remove loading state
      setLoadingFriendIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      await friendApi.acceptRequest(connectionId);
      showNotification('Request accepted!', 'success');
      if (subTab === 'requests') setPage(0);
      else if (subTab === 'home') {
        const res = await friendApi.getHomeSummary();
        setHomeSummary(res.data);
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to accept', 'error');
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
    try {
      await friendApi.declineRequest(connectionId);
      showNotification('Successfully declined the request', 'success');
      if (subTab === 'requests') setPage(0);
      else if (subTab === 'home') {
        const res = await friendApi.getHomeSummary();
        setHomeSummary(res.data);
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to decline', 'error');
    }
  };

  const handleMessageFriend = (friendId: string) => {
    navigate(`/chat/${friendId}`);
  };

  // ---- Sidebar & sub‑tab handlers ----
  const handleSetActiveTab = (tab: string) => {
    if (tab === 'chat') navigate('/chat');
    else if (tab === 'friends') navigate('/friends/home');
  };

  const handleSubTabChange = (tab: 'home' | 'friends' | 'requests' | 'suggestions') => {
    setPage(0);
    let path = '';
    if (tab === 'home') path = '/friends/home';
    else if (tab === 'friends') path = '/friends/all-friends';
    else if (tab === 'requests') path = '/friends/requests';
    else if (tab === 'suggestions') path = '/friends/suggestions';
    navigate(path);
  };

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
    <>
      {/* Notification toast */}
      {notification && (
        <div
          className={`position-fixed top-0 start-50 translate-middle-x mt-3 p-3 rounded-3 shadow-lg text-white ${
            notification.type === 'success' ? 'bg-success' : notification.type === 'error' ? 'bg-danger' : 'bg-info'
          }`}
          style={{ zIndex: 9999, maxWidth: '90%', transition: 'opacity 0.3s' }}
        >
          {notification.message}
        </div>
      )}
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
            loadingFriendIds={loadingFriendIds}
            requestedFriendIds={requestedFriendIds}
          />
        </div>
      </div>
    </>
  );
}