// ChatView is currently implemented in JavaScript without a declaration file.
// @ts-expect-error — the module is valid at runtime, but has no TypeScript declarations.
import ChatView from '../chat/ChatView';
import FriendsView from '../friends/FriendsView';
import ProfileView from '../profile/ProfileView'; // ✅ ADDED
import { type Friend, type HomeSummary } from '../../services/friendApi';

interface MainContentProps {
  activeTab: 'chat' | 'friends' | 'profile' | string; // ✅ UPDATED type
  contacts: any[];
  allUsers: Friend[];
  homeSummary?: HomeSummary | null;
  onConnect: (id: string) => void;
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
  onMessageFriend: (id: string) => void;
  subTab?: 'home' | 'friends' | 'requests' | 'suggestions';
  onSubTabChange?: (tab: 'home' | 'friends' | 'requests' | 'suggestions') => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingFriendIds?: Set<string>;
  requestedFriendIds?: Set<string>;
}

export default function MainContent({
  activeTab,
  contacts,
  allUsers,
  homeSummary,
  onConnect,
  onAcceptRequest,
  onDeclineRequest,
  onMessageFriend,
  subTab,
  onSubTabChange,
  loading,
  hasMore,
  onLoadMore,
  loadingFriendIds = new Set(),
  requestedFriendIds = new Set(),
}: MainContentProps) {
  return (
    <div className="flex-grow-1 p-4 bg-light overflow-auto">
      {activeTab === 'chat' ? (
        <ChatView contacts={contacts} />
      ) : activeTab === 'profile' ? ( // ✅ NEW CONDITION
        <ProfileView />
      ) : (
        <FriendsView
          friends={allUsers}
          homeSummary={homeSummary}
          onConnect={onConnect}
          onAcceptRequest={onAcceptRequest}
          onDeclineRequest={onDeclineRequest}
          onMessageFriend={onMessageFriend}
          activeTab={subTab || 'friends'}
          onTabChange={onSubTabChange || (() => {})}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          loadingFriendIds={loadingFriendIds}
          requestedFriendIds={requestedFriendIds}
        />
      )}
    </div>
  );
}