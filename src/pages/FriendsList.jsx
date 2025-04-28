function FriendList() {
  const friends = ["김오조", "홍길동", "엄세욱", "김은지", "정봉석", "김오조", "홍길동"];

  return (
    <div>
      {/* 검색창 */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded">
        <span>🔍</span>
        <input
          type="text"
          placeholder="검색"
          className="bg-transparent outline-none flex-1"
        />
      </div>

      {/* 친구 리스트 */}
      <div className="flex flex-col gap-3">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-white text-sm">
                ☀️
              </div>
              <span className="text-gray-800">{friend}</span>
            </div>
            <div>➡️</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendList; 