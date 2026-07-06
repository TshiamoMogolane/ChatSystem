import ChatView from '../chat/ChatView';
import FriendsView from '../friends/FriendsView';

type User = any; // extend with status later

interface MainContentProps {
  activeTab: 'chat' | 'friends' | string;
  contacts: User[];
  allUsers: User[]; // each user should have { id, name, email, online, status }
  onConnect: (userId: string) => void;
  onAcceptRequest: (userId: string) => void;
  onDeclineRequest: (userId: string) => void;
  onMessageFriend: (userId: string) => void;
}

export default function MainContent({
  activeTab,
  contacts,
  allUsers,
  onConnect,
  onAcceptRequest,
  onDeclineRequest,
  onMessageFriend,
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
        />
      )}
    </div>
  );
}