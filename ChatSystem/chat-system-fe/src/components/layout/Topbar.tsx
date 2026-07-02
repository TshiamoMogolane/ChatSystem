export default function Topbar({ activeTab }: { activeTab: string }) {
  return (
    <div
      className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center flex-shrink-0"
      style={{ height: '72px' }}  // 👈 fixed height for precise alignment
    >
      <h5 className="m-0 fw-semibold">
        {activeTab === 'chat' ? 'Your Conversations' : 'Find Friends'}
      </h5>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted small">My Profile</span>
        <div 
          className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px' }}
        >
          A
        </div>
      </div>
    </div>
  );
}