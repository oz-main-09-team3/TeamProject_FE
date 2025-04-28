import { useState } from 'react';
import FriendRowCard from '../components/FriendRowCard';

export default function FriendsPage() {
  const [search, setSearch] = useState('');

  const friends = [
    { id: 1, name: '김오조' },
    { id: 2, name: '홍길동' },
    { id: 3, name: '엄세욱' },
    { id: 4, name: '김은지' },
    { id: 5, name: '정봉석' },
    { id: 6, name: '김오조' },
    { id: 7, name: '홍길동' },
    { id: 8, name: '엄세욱' },
    { id: 9, name: '김은지' },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.includes(search)
  );

  return (
    <div className="flex pt-16 h-[calc(100vh-64px)]"> {/* 네비게이션바 높이만큼 pt 추가 */}
      {/* 왼쪽 */}
      <div className="flex-1 flex items-center justify-center text-gray-500">
        {filteredFriends.length === 0 && <div>친구 목록이 없습니다.</div>}
      </div>

      {/* 오른쪽 */}
      <div className="w-1/3 bg-pink-100 p-4 overflow-y-auto">
        {/* 검색창 */}
        <div className="flex items-center bg-white rounded-full px-4 py-2 mb-4">
          <button className="text-gray-400 mr-2">{'<'}</button>
          <input
            type="text"
            placeholder="검색"
            className="flex-1 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 친구 리스트 */}
        {filteredFriends.map(friend => (
          <FriendRowCard key={friend.id} name={friend.name} />
        ))}
      </div>
    </div>
  );
}
