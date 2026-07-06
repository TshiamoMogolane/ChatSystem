interface Friend {
  id: string;
  name: string;
  email: string;
  online: boolean;
  status: 'connected' | 'pending' | 'suggested';
}

interface FriendsViewProps {
  friends: Friend[];
  onConnect: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
  onMessageFriend: (id: string) => void;
  activeTab: 'friends' | 'requests' | 'suggestions';
  onTabChange: (tab: 'friends' | 'requests' | 'suggestions') => void;
}

export default function FriendsView({
  friends,
  onConnect,
  onAcceptRequest,
  onDeclineRequest,
  onMessageFriend,
  activeTab,
  onTabChange,
}: FriendsViewProps) {
  const getList = () => {
    switch (activeTab) {
      case 'friends':
        return friends.filter(f => f.status === 'connected');
      case 'requests':
        return friends.filter(f => f.status === 'pending');
      case 'suggestions':
        return friends.filter(f => f.status === 'suggested');
      default:
        return [];
    }
  };

  const displayedFriends = getList();

  return (
    <div className="h-100 d-flex flex-column bg-white rounded-3 shadow-sm border overflow-hidden">
      {/* Horizontal Tab Bar */}
      <div className="p-3 border-bottom d-flex align-items-center bg-white flex-shrink-0">
        <div className="d-flex gap-2 justify-content-center flex-grow-1">
          <button
            className={`btn btn-sm ${
              activeTab === 'friends' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => onTabChange('friends')}
          >
            👥 All Friends
          </button>
          <button
            className={`btn btn-sm ${
              activeTab === 'requests' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => onTabChange('requests')}
          >
            📨 Requests
          </button>
          <button
            className={`btn btn-sm ${
              activeTab === 'suggestions' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => onTabChange('suggestions')}
          >
            💡 Suggestions
          </button>
        </div>
        <span className="text-muted small ms-2">{displayedFriends.length} users</span>
      </div>

      {/* Scrollable list */}
      <div className="flex-grow-1 overflow-auto p-4">
        {displayedFriends.length === 0 ? (
          <p className="text-muted text-center">No users in this category</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {displayedFriends.map(friend => (
              <div
                key={friend.id}
                className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border"
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className={`rounded-circle ${
                      friend.online ? 'bg-success' : 'bg-secondary'
                    }`}
                    style={{ width: '10px', height: '10px' }}
                  />
                  <div>
                    <p className="fw-medium m-0 text-dark">{friend.name}</p>
                    <small className="text-muted">{friend.email}</small>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  {friend.status === 'connected' && (
                    <button
                      onClick={() => onMessageFriend(friend.id)}
                      className="btn btn-success btn-sm fw-medium rounded-3"
                    >
                      💬 Message
                    </button>
                  )}
                  {friend.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onAcceptRequest(friend.id)}
                        className="btn btn-primary btn-sm fw-medium rounded-3"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => onDeclineRequest(friend.id)}
                        className="btn btn-outline-danger btn-sm fw-medium rounded-3"
                      >
                        ✕ Decline
                      </button>
                    </>
                  )}
                  {friend.status === 'suggested' && (
                    <button
                      onClick={() => onConnect(friend.id)}
                      className="btn btn-primary btn-sm fw-medium rounded-3"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}