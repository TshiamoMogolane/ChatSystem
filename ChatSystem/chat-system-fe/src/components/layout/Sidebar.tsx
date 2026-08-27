import { FaComments, FaUserFriends, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void; // optional
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <div
      className="d-flex flex-column align-items-center py-4"
      style={{
        width: '80px',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--primary)',
        justifyContent: 'space-between',
      }}
    >
      {/* ----- TOP SECTION: Logo + Chats & Friends ----- */}
      <div className="d-flex flex-column align-items-center gap-3">
        <img
          src="/logo.png"  // Changed from ../public/logo.png to /logo.png
          alt="App Logo"
          style={{
            width: '46px',
            height: '46px',
            objectFit: 'cover',
            marginBottom: '8px',
          }}
        />

        <button
          onClick={() => setActiveTab('chat')}
          className={`sidebar-btn ${activeTab === 'chat' ? 'active' : ''}`}
          title="Chats"
        >
          <FaComments size={24} />
        </button>

        <button
          onClick={() => setActiveTab('friends')}
          className={`sidebar-btn ${activeTab === 'friends' ? 'active' : ''}`}
          title="Find Friends"
        >
          <FaUserFriends size={24} />
        </button>
      </div>

      {/* ----- BOTTOM SECTION: Profile → Settings → Logout ----- */}
      <div className="d-flex flex-column align-items-center gap-3">
        {/* Separator */}
        <div
          style={{
            width: '36px',
            height: '1px',
            backgroundColor: 'var(--primary-light)',
          }}
        />

        {/* ✅ UPDATED: Profile button now sets activeTab to 'profile' */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
          title="Profile"
        >
          <FaUser size={22} />
        </button>

        <button
          onClick={() => console.log('Settings clicked')}
          className="sidebar-btn"
          title="Settings"
        >
          <FaCog size={22} />
        </button>

        <button
          onClick={onLogout || (() => console.log('Logout clicked'))}
          className="sidebar-btn"
          title="Logout"
        >
          <FaSignOutAlt size={22} />
        </button>
      </div>

      {/* Add these styles in your global CSS or index.css */}
      <style>{`
        .sidebar-btn {
          background: none;
          border: none;
          color: #6c757d;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .sidebar-btn:hover {
          background-color: #f0f4ff;
          color: #007bff;
        }
        .sidebar-btn.active {
          background-color: #007bff;
          color: #ffffff;
        }
        .sidebar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}