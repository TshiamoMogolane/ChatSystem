interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div 
      className="d-flex flex-column align-items-center bg-primary text-white py-4"
      style={{ width: '80px', height: '100vh' }}
    >
      {/* Chat Icon Button */}
      <button
        onClick={() => setActiveTab('chat')}
        className={`btn border-0 rounded-3 p-3 mb-3 ${
          activeTab === 'chat' ? 'btn-light text-primary' : 'btn-outline-light'
        }`}
        title="Chats"
        style={{ fontSize: '1.5rem' }}
        
      >
        💬
      </button>

      {/* Friends Icon Button */}
      <button
        onClick={() => setActiveTab('friends')}
        className={`btn border-0 rounded-3 p-3 ${
          activeTab === 'friends' ? 'btn-light text-primary' : 'btn-outline-light'
        }`}
        title="Find Friends"
        style={{ fontSize: '1.5rem' }}
      >
        👥
      </button>
    </div>
  );
}