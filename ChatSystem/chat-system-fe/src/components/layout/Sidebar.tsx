import { FaComments, FaUserFriends, FaCog, FaSignOutAlt } from 'react-icons/fa';
// 👇 Optional: if you want a placeholder icon for the logo
// import { FaCommentDots } from 'react-icons/fa';

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
        height: '100%',           // ✅ Use 100% to fill the parent row
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--primary)', // Blue border (or var(--border) if you prefer)
        justifyContent: 'space-between',
      }}
    >
      {/* ----- TOP SECTION: Logo + Chats & Friends ----- */}
      <div className="d-flex flex-column align-items-center gap-3">

        {/* 🖼️ LOGO – place your own image here */}
        <img
          src="../public/logo.png"         // 👈 put your logo in public/logo.png
          alt="App Logo"
          style={{
            width: '46px',
            height: '46px',
            objectFit: 'cover',
            marginBottom: '8px',    // extra space below logo
          }}
        />
        {/* If you don't have a logo yet, you can use an icon: */}
        {/* <FaCommentDots size={32} color="var(--primary)" style={{ marginBottom: '8px' }} /> */}

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
        <div
          style={{
            width: '36px',
            height: '1px',
            backgroundColor: 'var(--primary-light)',
          }}
        />
        <button
          onClick={() => console.log('Settings clicked')}
          className="sidebar-btn"
          title="Settings"
        >
          <FaCog size={22} />
        </button>
        <button
          onClick={() => console.log('Logout clicked')}
          className="sidebar-btn"
          title="Logout"
        >
          <FaSignOutAlt size={22} />
        </button>
      </div>
    </div>
  );
}