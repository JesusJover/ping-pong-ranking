import LastMatches from "./components/LastMatches";
import Leaderboard from "./components/Leaderboard";

import Link from 'next/link'

export default function Home() {
   return (
      <div>
         <div className="grid lg:grid-cols-2 items-start max-w-[1500px] m-auto py-6 gap-10">
            <div className="flex justify-center items-center">
               <Leaderboard />
            </div>

            <div className="flex flex-col items-center gap-6">
               <LastMatches />
            </div>
         </div>

         <div className="flex gap-4 justify-center py-6">
            <Link href="/iniciar-partido" className="bg-ping-pong-blue flex items-center text-white p-3 rounded-lg text-xs md:text-sm lg:text-xl hover:bg-opacity-45">Iniciar partido</Link>
            <Link href="/registrar-partido" className="border border-ping-pong-blue flex items-center text-ping-pong-blue p-3 rounded-lg text-xs md:text-sm xl:text-xl hover:bg-ping-pong-blue hover:bg-opacity-45">Registrar partido</Link>
            <Link href="/marcador" className="border border-ping-pong-blue flex items-center text-ping-pong-blue p-3 rounded-lg text-xs md:text-sm xl:text-xl hover:bg-ping-pong-blue hover:bg-opacity-45">
               <IconScoreboardOutline className="w-6 h-6" />
            </Link>
         </div>
      </div>
   );
}

function IconScoreboardOutline(props) {
   return (
      <svg
         viewBox="0 0 24 24"
         fill="currentColor"
         height="1em"
         width="1em"
         {...props}
      >
         <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H3V5h18M5 7h4c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V8c0-.6.4-1 1-1m1 2v6h2V9m7-2h4c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1h-4c-.6 0-1-.4-1-1V8c0-.6.4-1 1-1m1 2v6h2V9m-6 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1m0 4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z" />
      </svg>
   );
}