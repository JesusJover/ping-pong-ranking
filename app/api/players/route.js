import db from '../../models/_connection-admin'

export async function GET(req) {
   const { docs, size } = await db.collection('jugadores').get()
   const players = docs.map(doc => doc.data())

   return Response.json(players)
}
