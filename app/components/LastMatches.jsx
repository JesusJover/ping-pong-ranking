import Link from 'next/link'
import db from '../models/_connection-admin'
import Match from './Match'
import Title from './Title'
import { cookies } from 'next/headers'

export default async function LastMatches() {
   let _ = cookies()
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
      <div className="w-full flex flex-col lg:justify-center items-center gap-5 py-4">
            <Title>Últimos partidos</Title>
            <div className="w-[90%] lg:w-[80%]"> 
               { matches.map((match, index) => 
                  <Match key={index} match={match} />
                  )
               }
            </div>
            <Link className='text-blue-500' href="/partidos"> Ver todos los partidos </Link>
      </div>
   )
}