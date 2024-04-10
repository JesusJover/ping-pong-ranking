import Leaderboard from "./components/Leaderboard";

export default function Home() {
  return (
   <div className="grid lg:grid-cols-2 h-[85vh]">
      <div className="h-full flex justify-center items-center">
         <Leaderboard />
      </div>
      <div className="border bg-red-400 border-red-400 h-full flex justify-center items-center">
         Last matches
         and buttons y soy Jesús
      </div>
   </div>
  );
}
