import LastMatches from "./components/LastMatches";
import Leaderboard from "./components/Leaderboard";

import Link from 'next/link'

export default function Home() {
  return (
   <div className="grid lg:grid-cols-2 h-[85vh]">
      <div className="h-full flex justify-center items-center">
         <Leaderboard />
      </div>

      <div className="h-full flex flex-col justify-center items-center gap-6">
         <LastMatches />
         <div className="flex gap-4 justify-center">
            {/* <button className="bg-ping-pong-blue text-white p-3 rounded-lg text-xl hover:bg-opacity-45">Iniciar partido</button> */}
            <Link href="/iniciar-partido" className="bg-ping-pong-blue text-white p-3 rounded-lg text-xl hover:bg-opacity-45">Iniciar partido</Link>
            <Link href="/registrar-partido"  className="border border-ping-pong-blue text-ping-pong-blue p-3 rounded-lg text-xl hover:bg-ping-pong-blue hover:bg-opacity-45">Registrar partido</Link>
            <Link href="/todos-partidos" className="bg-ping-pong-blue text-white p-3 rounded-lg text-xl hover:bg-opacity-45">TODOS LOS PARTIDOS</Link>
         </div>
      </div>
   </div>
  );
}
