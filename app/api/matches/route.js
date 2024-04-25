import db from '../../models/_connection-admin'

export async function POST(req) {
   // Getting body data
   const body = await req.json()
   console.log(body)

   if (!body){
      return Response.json("No body", {status: 400})
   }

   const { docs, size } = await db.collection('jugadores').get()
   const players = docs.map(doc => doc.data())

   const matchesRef = db.collection('partidos')
   const match = {
      jugador1: body.player1,
      puntuacion1: parseInt(body.punt1),
      jugador2: body.player2,
      puntuacion2: parseInt(body.punt2),
      arbitro: body.referee,
      inicio: new Date(),
      fin: new Date()
   }

   // Saving matches
   await matchesRef.add(match)

   return Response.json("OK")
}