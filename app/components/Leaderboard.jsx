
import db from '../models/_connection-admin'

// Components
import Title from './Title'
import Link from 'next/link'

export default async function Leaderboard () {
   // Code example to get data from Firestore
   const { docs, size } = await db.collection('jugadores').get()
   const players = docs.map(doc => doc.data())

   const playersSorted = players.sort((a, b) => b.puntos - a.puntos) 

   return(
      <div className="w-full flex flex-col justify-start items-center gap-5">
         <Title>Clasificación</Title>
         <div className="w-[90%] lg:w-[80%] border">
            { playersSorted.map((player, index) => ( 
               <div key={index} className="flex text-sm md:text-xl lg:text-2xl justify-between p-2 px-4 lg:py-3 lg:px-4 odd:bg-slate-200 even:bg-white">
                  <p className="font-bold w-[10%]">{index+1}</p>
                  <p className="w-[65%]">
                     <Link href={`/jugador/${player.id}`}>
                        {player.nombre}
                     </Link>
                  </p>
                  <p className="lg:w-[25%]">{player.puntos} <span className="text-xs lg:text-xl">pts</span></p>
               </div>
            )
            )}
         </div>
      </div>
   )
}