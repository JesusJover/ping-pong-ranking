import db from '../models/_connection-admin'
import Match from '../components/Match'
import Title from '../components/Title'
import { cookies } from 'next/headers'

export default async function Partidos() {
    let _ = cookies()
    const { docs: matchesDocs } = await db.collection('partidos')
        .orderBy('fin', 'desc')
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

    const { docs: playersDocs } = await db.collection('jugadores')
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
              <Title>Todos los partidos</Title>
              <div className="w-[90%] lg:w-[50%]"> 
              { matches.map((match, index) => 
                 <Match key={index} match={match} />
                 )
              }
              </div>
        </div>
     )
}