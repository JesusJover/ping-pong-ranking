import db from '../../models/_connection-admin'

export async function POST(req) {
   // Getting body data
   const body = await req.json()
   console.log(body)

   if (!body){
      return Response.json("No body", {status: 400})
   }

   // const { docs, size } = await db.collection('jugadores').get()
   // const players = docs.map(doc => doc.data())



   return Response.json("OK")
}