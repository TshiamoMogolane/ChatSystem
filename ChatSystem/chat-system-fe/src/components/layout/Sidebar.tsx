import { FaComments, FaUserFriends, FaCog, FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div
      className="d-flex flex-column align-items-center py-4"
      style={{
        width: '80px',
        height: '100vh',
        backgroundColor: '#ffffff', // clean white, matching your auth container
        borderRight: '1px solid var(--border)',
        justifyContent: 'space-between', // pushes top and bottom sections apart
      }}
    >
      {/* ----- TOP SECTION: Chats & Friends ----- */}
      <div className="d-flex flex-column align-items-center gap-3">
        {/* Chat Button */}
        <button
          onClick={() => setActiveTab('chat')}
          className={`sidebar-btn ${activeTab === 'chat' ? 'active' : ''}`}
          title="Chats"
        >
          <FaComments size={24} />
        </button>

        {/* Friends Button */}
        <button
          onClick={() => setActiveTab('friends')}
          className={`sidebar-btn ${activeTab === 'friends' ? 'active' : ''}`}
          title="Find Friends"
        >
          <FaUserFriends size={24} />
        </button>
      </div>

      {/* ----- BOTTOM SECTION: Settings & Logout ----- */}
      <div className="d-flex flex-column align-items-center gap-3">
        {/* Separator Line */}
        <div
          style={{
            width: '36px',
            height: '1px',
            backgroundColor: 'var(--border)',
          }}
        />

        {/* Settings Button */}
        <button
          onClick={() => {
            // TODO: Open settings modal or navigate
            console.log('Settings clicked');
          }}
          className="sidebar-btn"
          title="Settings"
        >
          <FaCog size={22} />
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            // TODO: Handle logout (clear token, redirect)
            console.log('Logout clicked');
          }}
          className="sidebar-btn"
          title="Logout"
        >
          <FaSignOutAlt size={22} />
        </button>
      </div>
    </div>
  );
}