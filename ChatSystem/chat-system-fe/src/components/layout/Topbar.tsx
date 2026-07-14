interface TopbarProps {
  activeTab: 'chat' | 'friends' | string;
  subTab?: 'home' | 'friends' | 'requests' | 'suggestions';
}

export default function Topbar({ activeTab, subTab }: TopbarProps) {
  let title = '';
  if (activeTab === 'chat') {
    title = 'Chats';
  } else if (activeTab === 'friends') {
    switch (subTab) {
      case 'home': title = 'Home'; break;
      case 'friends': title = 'My Friends'; break;
      case 'requests': title = 'Requests'; break;
      case 'suggestions': title = 'Suggestions'; break;
      default: title = 'Friends';
    }
  }
  return (
    <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom flex-shrink-0" style={{ height: '64px' }}>
      <h5 className="mb-0 fw-semibold">{title}</h5>
      {/* ... search bar etc ... */}
    </div>
  );
}