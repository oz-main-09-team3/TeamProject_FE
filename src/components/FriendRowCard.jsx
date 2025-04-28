export default function FriendRowCard({ name }) {
    return (
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
            🌟
          </div>
          <span>{name}</span>
        </div>
        <button className="text-gray-500">{'>'}</button>
      </div>
    );
  }
  