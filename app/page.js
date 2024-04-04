export default function Home() {
  return (
   <div className="grid grid-cols-2 h-[85vh]">
      <div className="border border-green-400 h-full flex justify-center items-center">
         Leaderboard
      </div>
      <div className="border border-red-400 h-full flex justify-center items-center">
         Last matches
         and buttons
      </div>
   </div>
  );
}
