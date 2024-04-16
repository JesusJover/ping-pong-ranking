import db from '../models/_connection-admin'
import { firestore } from 'firebase-admin'
import Title from './Title'

export default async function LastMatches() {
   const { docs: matchesDocs } = await db.collection('partidos')
                           .orderBy('fin', 'desc')
                           .limit(5)
                           .get()
   let matches = matchesDocs.map(doc => doc.data())

   const playersIds = []
   matches.map(match => {
      if (!playersIds.includes(match.jugador1)) {
         playersIds.push(match.jugador1)
      }
      if (!playersIds.includes(match.jugador2)) {
         playersIds.push(match.jugador2)
      }
   })

   const { docs: playersDocs} = await db.collection('jugadores')
                           .where("id", 'in', playersIds)
                           .get()

   const players = playersDocs.map(doc => doc.data())

   matches = matches.map(match => {
      const player1 = players.find(player => player.id === match.jugador1)
      const player2 = players.find(player => player.id === match.jugador2)

      return {
         ...match,
         jugador1: player1,
         jugador2: player2
      }
   })

   return (
      <div className="w-full flex flex-col lg:justify-center items-center gap-5">
            <Title>Últimos partidos</Title>
            <div className="w-[90%] lg:w-[80%]"> 
            { matches.map((match, index) => 
               <div key={index} className="p-3 odd:bg-slate-200 even:bg-white
                  grid grid-cols-3 justify-between">
                  <div className={`flex-col items-start ${match.puntuacion1 > match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>
                     <h3 className="text-xl font-bold">{match.jugador1.nombre}</h3>
                     <p>{match.puntos1 > 0 ? `+${match.puntos1}` : match.puntos1}</p>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                     <p className={`text-3xl font-bold ${match.puntuacion1 > match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>{match.puntuacion1}</p>
                     <p>vs</p>
                     <p className={`text-3xl font-bold ${match.puntuacion1 < match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>{match.puntuacion2}</p>
                  </div>

                 <div className={`flex-col items-end ${match.puntuacion1 < match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>
                     <h3 className="text-xl font-bold text-right">{match.jugador2.nombre}</h3>
                     <p className='text-right'>{match.puntos2 > 0 ? `+${match.puntos2}` : match.puntos2}</p>
                 </div>
               </div>
               )
            }
            </div>
      </div>
   )
}