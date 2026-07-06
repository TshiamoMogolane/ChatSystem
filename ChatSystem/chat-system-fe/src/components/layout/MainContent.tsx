import ChatView from '../chat/ChatView';
import FriendsView from '../friends/FriendsView';

type User = any;

interface MainContentProps {
  activeTab: 'chat' | 'friends' | string;
  contacts: User[];
  allUsers: User[];
  onConnect: (userId: string) => void;
}

export default function MainContent({ activeTab, contacts, allUsers, onConnect }: MainContentProps) {
  return (
    <div className="flex-grow-1 p-4 bg-light overflow-auto">
      {activeTab === 'chat' ? (
        // Chat gets ONLY the existing friends
        <ChatView contacts={contacts} />
      ) : (
        // Find Friends gets ALL registered users
        <FriendsView friends={allUsers} onConnect={onConnect} />
      )}
    </div>
  );
}