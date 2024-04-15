import LastMatches from "./components/LastMatches";
import Leaderboard from "./components/Leaderboard";

export default function Home() {
  return (
   <div className="grid lg:grid-cols-2 h-[85vh]">
      <div className="h-full flex justify-center items-center">
         <Leaderboard />
      </div>

      <div className="h-full flex justify-center items-center">
         <LastMatches />
      </div>
   </div>
  );
}
