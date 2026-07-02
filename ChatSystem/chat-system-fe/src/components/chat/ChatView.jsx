import { useState } from 'react';

export default function ChatView({ contacts }) {
  // State to track which contact is clicked
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-100 d-flex bg-white rounded-3 shadow-sm border overflow-hidden">
      
      {/* ===== LEFT PANEL: CONTACT LIST ===== */}
      <div className="bg-light border-end d-flex flex-column" style={{ width: '300px', minWidth: '250px' }}>
        {/* Header */}
        <div className="p-3 border-bottom bg-white">
          <h6 className="m-0 fw-bold">Your Chats</h6>
        </div>

        {/* Scrollable Contact List */}
        <div className="overflow-auto flex-grow-1">
          {contacts.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`d-flex align-items-center gap-3 p-3 border-bottom ${
                selectedUser?.id === user.id ? 'bg-primary bg-opacity-10' : ''
              }`}
              style={{ cursor: 'pointer' }}
            >
              {/* Avatar + Online Dot */}
              <div className="position-relative">
                <div 
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px', fontSize: '1rem' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div 
                  className={`position-absolute bottom-0 end-0 rounded-circle border border-white ${
                    user.online ? 'bg-success' : 'bg-secondary'
                  }`}
                  style={{ width: '12px', height: '12px' }}
                ></div>
              </div>

              {/* Name + Last Message / Status */}
              <div className="flex-grow-1 overflow-hidden">
                <p className="m-0 fw-medium text-truncate">{user.name}</p>
                <small className="text-muted text-truncate d-block">
                  {user.online ? '🟢 Online' : 'Offline'}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== RIGHT PANEL: CHAT WINDOW ===== */}
      <div className="flex-grow-1 d-flex flex-column bg-white">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-bottom d-flex align-items-center bg-white">
              <div 
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}
              >
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="m-0 fw-medium">{selectedUser.name}</p>
                <small className="text-muted">
                  {selectedUser.online ? 'Online' : 'Last seen recently'}
                </small>
              </div>
            </div>

            {/* Chat Messages Area (placeholder for now) */}
            <div className="flex-grow-1 p-4 bg-light d-flex flex-column align-items-center justify-content-center">
              <p className="text-muted text-center">
                Start chatting with <strong>{selectedUser.name}</strong>!
                <br />
                <small>(Messages will appear here soon)</small>
              </p>
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-top bg-white d-flex gap-2">
              <input 
                type="text" 
                className="form-control rounded-3" 
                placeholder="Type a message..." 
              />
              <button className="btn btn-primary rounded-3 px-4">Send</button>
            </div>
          </>
        ) : (
          /* Default view when NO contact is selected */
          <div className="h-100 d-flex flex-column align-items-center justify-content-center">
            <div className="display-1 mb-3">💬</div>
            <h5 className="text-muted">Select a contact to start chatting</h5>
            <p className="text-muted small">Click on any user from the left panel</p>
          </div>
        )}
      </div>
    </div>
  );
}