import ChatView from '../chat/ChatView';
import FriendsView from '../friends/FriendsView';

type User = any;

interface MainContentProps {
  activeTab: 'chat' | 'friends' | string;
  contacts: User[];
  allUsers: User[];
  onConnect: (userId: string) => void;
  onAcceptRequest: (userId: string) => void;
  onDeclineRequest: (userId: string) => void;
  onMessageFriend: (userId: string) => void;
  subTab?: 'friends' | 'requests' | 'suggestions';
  onSubTabChange?: (tab: 'friends' | 'requests' | 'suggestions') => void;
}

export default function MainContent({
  activeTab,
  contacts,
  allUsers,
  onConnect,
  onAcceptRequest,
  onDeclineRequest,
  onMessageFriend,
  subTab,
  onSubTabChange,
}: MainContentProps) {
  return (
    <div className="flex-grow-1 p-4 bg-light overflow-auto">
      {activeTab === 'chat' ? (
        <ChatView contacts={contacts} />
      ) : (
        <FriendsView
          friends={allUsers}
          onConnect={onConnect}
          onAcceptRequest={onAcceptRequest}
          onDeclineRequest={onDeclineRequest}
          onMessageFriend={onMessageFriend}
          activeTab={subTab || 'friends'}
          onTabChange={onSubTabChange || (() => {})}
        />
      )}
    </div>
  );
}