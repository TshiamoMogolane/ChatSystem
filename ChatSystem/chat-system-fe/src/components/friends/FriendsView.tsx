export default function FriendsView({ friends, onConnect }) {
  return (
    <div className="bg-white rounded-3 shadow-sm border p-4 mx-auto" style={{ maxWidth: '800px' }}>
      <h6 className="fw-medium text-secondary mb-3">Registered Users</h6>
      <div className="d-flex flex-column gap-3">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border"
          >
            <div className="d-flex align-items-center gap-3">
              {/* Online / Offline Dot */}
              <div
                className={`rounded-circle ${friend.online ? 'bg-success' : 'bg-secondary'}`}
                style={{ width: '10px', height: '10px' }}
              ></div>
              <div>
                <p className="fw-medium m-0 text-dark">{friend.name}</p>
                <small className="text-muted">{friend.email}</small>
              </div>
            </div>
            <button
              onClick={() => onConnect(friend.id)}
              className="btn btn-primary btn-sm fw-medium rounded-3"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}