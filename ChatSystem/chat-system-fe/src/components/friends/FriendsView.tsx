import {
  FaHome,
  FaUserFriends,
  FaEnvelope,
  FaLightbulb,
  FaArrowRight,
  FaInbox,
  FaUserPlus,
  FaCheck,
  FaTimes,
  FaComment,
} from 'react-icons/fa';
import { type Friend, type HomeSummary } from '../../services/friendApi';

interface FriendsViewProps {
  friends: Friend[];
  homeSummary?: HomeSummary | null;
  onConnect: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
  onMessageFriend: (id: string) => void;
  activeTab: 'home' | 'friends' | 'requests' | 'suggestions';
  onTabChange: (tab: 'home' | 'friends' | 'requests' | 'suggestions') => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function FriendsView({
  friends,
  homeSummary,
  onConnect,
  onAcceptRequest,
  onDeclineRequest,
  onMessageFriend,
  activeTab,
  onTabChange,
  loading,
  hasMore,
  onLoadMore,
}: FriendsViewProps) {
  // ---- Derive lists based on activeTab ----
  let displayedFriends: Friend[] = [];
  let pendingRequests: Friend[] = [];
  let suggestedUsers: Friend[] = [];
  let totalCount = 0;

  if (activeTab === 'home') {
    pendingRequests = homeSummary?.pending || [];
    suggestedUsers = homeSummary?.suggestions || [];
    totalCount = (homeSummary?.pendingCount || 0) + (homeSummary?.suggestionsCount || 0);
  } else {
    displayedFriends = friends;
    pendingRequests = friends.filter(f => f.status === 'pending');
    suggestedUsers = friends.filter(f => f.status === 'suggested');
    totalCount = friends.length;
  }

  const MAX_PENDING_DISPLAY = 4;
  const pendingToDisplay = pendingRequests.slice(0, MAX_PENDING_DISPLAY);

  const getTitle = () => {
    switch (activeTab) {
      case 'home': return 'Home';
      case 'friends': return 'My Friends';
      case 'requests': return 'Requests';
      case 'suggestions': return 'Suggestions';
      default: return '';
    }
  };

  return (
    <div className="h-100 d-flex flex-column bg-white rounded-3 shadow-sm border overflow-hidden">
      {/* Horizontal Tab Bar */}
      <div className="p-3 border-bottom d-flex align-items-center bg-white flex-shrink-0">
        <div className="fw-semibold text-dark" style={{ minWidth: '120px' }}>
          {getTitle()}
        </div>

        <div className="d-flex gap-2 justify-content-center flex-grow-1">
          <button
            className={`btn btn-sm ${activeTab === 'home' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onTabChange('home')}
          >
            <FaHome className="me-1" /> Home
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'friends' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onTabChange('friends')}
          >
            <FaUserFriends className="me-1" /> All Friends
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'requests' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onTabChange('requests')}
          >
            <FaEnvelope className="me-1" /> Requests
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'suggestions' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onTabChange('suggestions')}
          >
            <FaLightbulb className="me-1" /> Suggestions
          </button>
        </div>

        {activeTab !== 'home' && (
          <span className="text-muted small ms-2" style={{ minWidth: '80px', textAlign: 'right' }}>
            {totalCount} users
          </span>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-grow-1 overflow-auto p-4">
        {activeTab === 'home' ? (
          // ---- HOME TAB ----
          <div className="d-flex flex-column gap-3">
            {/* Pending Requests section */}
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0"><FaInbox className="me-2" /> Pending Requests</h6>
                {pendingRequests.length > MAX_PENDING_DISPLAY && (
                  <button
                    className="btn btn-link btn-sm p-0 text-decoration-none"
                    onClick={() => onTabChange('requests')}
                  >
                    See all <FaArrowRight className="ms-1" />
                  </button>
                )}
              </div>
              {pendingRequests.length === 0 ? (
                <p className="text-muted small">No pending requests</p>
              ) : (
                <div className="row g-3">
                  {pendingToDisplay.map(friend => (
                    <div key={friend.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <FriendCard
                        friend={friend}
                        onAccept={onAcceptRequest}
                        onDecline={onDeclineRequest}
                        onConnect={onConnect}
                        onMessage={onMessageFriend}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="my-1" />

            {/* Suggested Users section */}
            <div>
              <h6 className="mb-2"><FaUserPlus className="me-2" /> People you may know</h6>
              {suggestedUsers.length === 0 ? (
                <p className="text-muted small">No suggestions at the moment</p>
              ) : (
                <div className="row g-3">
                  {suggestedUsers.map(friend => (
                    <div key={friend.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <FriendCard
                        friend={friend}
                        onAccept={onAcceptRequest}
                        onDecline={onDeclineRequest}
                        onConnect={onConnect}
                        onMessage={onMessageFriend}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // ---- OTHER TABS ----
          <>
            {displayedFriends.length === 0 ? (
              <p className="text-muted text-center">No users in this category</p>
            ) : (
              <div className="row g-3">
                {displayedFriends.map(friend => (
                  <div key={friend.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <FriendCard
                      friend={friend}
                      onAccept={onAcceptRequest}
                      onDecline={onDeclineRequest}
                      onConnect={onConnect}
                      onMessage={onMessageFriend}
                    />
                  </div>
                ))}
              </div>
            )}
            {/* Load More button */}
            {hasMore && (
              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={onLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---- Friend Card component (to avoid repetition) ----
function FriendCard({
  friend,
  onAccept,
  onDecline,
  onConnect,
  onMessage,
}: {
  friend: Friend;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onConnect: (id: string) => void;
  onMessage: (id: string) => void;
}) {
  return (
    <div className="card h-100 shadow-sm border-0 bg-light">
      <div className="card-body d-flex flex-column align-items-center text-center">
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
          style={{ width: '64px', height: '64px', fontSize: '1.5rem', fontWeight: 500 }}
        >
          {friend.name.charAt(0).toUpperCase()}
        </div>
        <h6 className="card-title mb-0 text-dark">{friend.name}</h6>
        <small className="text-muted">{friend.email}</small>
        <div className="mt-3 d-flex gap-2 flex-wrap justify-content-center">
          {friend.status === 'connected' && (
            <button
              onClick={() => onMessage(friend.id)}
              className="btn btn-success btn-sm fw-medium rounded-3"
            >
              <FaComment className="me-1" /> Message
            </button>
          )}
          {friend.status === 'pending' && (
            <>
              <button
                onClick={() => onAccept(friend.id)}
                className="btn btn-primary btn-sm fw-medium rounded-3"
              >
                <FaCheck className="me-1" /> Accept
              </button>
              <button
                onClick={() => onDecline(friend.id)}
                className="btn btn-outline-danger btn-sm fw-medium rounded-3"
              >
                <FaTimes className="me-1" /> Decline
              </button>
            </>
          )}
          {friend.status === 'suggested' && (
            <button
              onClick={() => onConnect(friend.id)}
              className="btn btn-primary btn-sm fw-medium rounded-3"
            >
              <FaUserPlus className="me-1" /> Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}