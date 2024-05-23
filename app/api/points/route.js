import db from '../../models/_connection-admin'
import { ComputePlayerStatistics } from '../../models/statistics'

export async function POST(req, res) {
   // Get body from JSON
   const { key } = await req.json()

   // Check if the key is correct
   if (key !== process.env.SECRET_KEY) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
   }

   const matchesCol = db.collection('partidos')
   const playersCol = db.collection('jugadores')

   const playersRefs = await playersCol.get()
   // Reset all points to 1000 with a batch write
   await db.runTransaction(async (t) => {
      playersRefs.docs.forEach(async (doc) => {
         // Set the points to 1000
         await t.update(playersCol.doc(doc.id), {
            puntos: 100,
            estadisticas: {
               derrotas: 0,
               victorias: 0,
               puntosGanados: 0,
               puntosPerdidos: 0,
               partidos: 0
            },
            ranking: {
               puntos: 0,
               posicion: -1
            }
         })

         // Now, reset player collections historicoEstadisticas, historicoRanking
         const historicoEstadisticas = playersCol.doc(doc.id).collection('historicoEstadisticas')
         const historicoRanking = playersCol.doc(doc.id).collection('historicoRanking')

         const batch = db.batch()
         // Delete all documents in historicoEstadisticas
         await historicoEstadisticas.get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
               batch.delete(doc.ref)
            })
         })
         // Delete all documents in historicoRanking
         await historicoRanking.get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
               batch.delete(doc.ref)
            })
         })

         // Commit the batch
         batch.commit()
      })
   })

   // Add a 500 ms delay to avoid exceeding the quota
   await new Promise(resolve => setTimeout(resolve, 500))

   // Getting snapshots of all matches
   const matchesRefs = await matchesCol.orderBy('fin', 'asc').get()

   for (const match of matchesRefs.docs) {
      await db.runTransaction(async (t) => {
         // Getting players data
         // const player1 = await playersCol.doc(await match.data().jugador1).get()
         // const player2 = await playersCol.doc(await match.data().jugador2).get()
         const player1 = await t.get(playersCol.doc(await match.data().jugador1))
         const player2 = await t.get(playersCol.doc(await match.data().jugador2))

         // Getting points from players and match
         // const puntosRanking1 = player1.data().puntos
         // const puntosRanking2 = player2.data().puntos
         // const puntuacion1 = match.data().puntuacion1
         // const puntuacion2 = match.data().puntuacion2
         const puntosRanking1 = player1.data().puntos
         const puntosRanking2 = player2.data().puntos
         const puntuacion1 = match.data().puntuacion1
         const puntuacion2 = match.data().puntuacion2
         const date = match.data().fin.toDate()

         // TODO: Check if the time is correct
         // Storing the current value of the player's statistics in historicoEstadisticas
         const historicoEstadisticas1 = player1.ref.collection('historicoEstadisticas')
         const historicoEstadisticas2 = player2.ref.collection('historicoEstadisticas')

         // Add the current statistics to the historical statistics
         historicoEstadisticas1.add({
            fecha: date,
            ...player1.data().estadisticas
         })

         historicoEstadisticas2.add({
            fecha: date,
            ...player2.data().estadisticas
         })

         // Storing the current value of the player's ranking in historicoRanking
         // const historicoRanking1 = player1.ref.collection('historicoRanking')
         // const historicoRanking2 = player2.ref.collection('historicoRanking')

         // // Add the current ranking to the historical ranking
         // historicoRanking1.add({
         //    fecha: date,
         //    ...player1.data().ranking
         // })

         // historicoRanking2.add({
         //    fecha: date,
         //    ...player2.data().ranking
         // })


         // Computing match result and updating player's points
         let prob
         if (puntuacion1 > puntuacion2) {
            // Probabilidad de que gane el jugador 2, se le aplica al 1
            prob = puntosRanking2 / (puntosRanking1 + puntosRanking2)
         } else {
            // Probabilidad de que gane el jugador 1, se le aplica al 2
            prob = puntosRanking1 / (puntosRanking1 + puntosRanking2)
         }

         // If prob is NAN, set it to 0.5
         if (puntosRanking1 === 0 || puntosRanking2 === 0) {
            prob = 0.5
         }

         const KDiff = 1
         const KRanking = 18
         const diffPuntos = (Math.abs(puntuacion1 - puntuacion2) - 1) / 10
         // const actualizacion = parseInt(K * prob * diffPuntos)
         // const actualizacionRanking = prob * KRanking
         const actualizacionRanking = (prob > 0.5 ? (10 + (prob - 0.5) * 180) : prob * 20)
         const actualizacionDiferencia = (prob > 0.5 ? (10 + (prob - 0.5) * 10) : prob * 10) * diffPuntos * KDiff
         const actualizacion = parseInt(actualizacionRanking + actualizacionDiferencia)
         // console.log("Suma/resta: " + actualizacion + " Ranking: " + actualizacionRanking + " Aport. dif. part.: " + actualizacionDiferencia + " Prob: " + prob + " Puntos1: " + puntuacion1 + " Puntos2: " + puntuacion2 + " PuntosRanking1: " + puntosRanking1 + " PuntosRanking2: " + puntosRanking2)

         // Compute new player statistics using before statistics
         const newStats1 = await ComputePlayerStatistics(player1.data().id, match.data(), player1.data().estadisticas)
         const newStats2 = await ComputePlayerStatistics(player2.data().id, match.data(), player2.data().estadisticas)

         if (puntuacion1 > puntuacion2) {
            // await playersCol.doc(player1.id).update({
            //    puntos: puntosRanking1 + actualizacion
            // })
            // await playersCol.doc(player2.id).update({
            //    puntos: puntosRanking2 - actualizacion
            // })
            // await matchesCol.doc(match.id).update({
            //    puntos1: actualizacion,
            //    puntos2: -actualizacion
            // })

            t.update(playersCol.doc(player1.id), {
               puntos: puntosRanking1 + actualizacion,
               estadisticas: newStats1
            })

            t.update(playersCol.doc(player2.id), {
               puntos: puntosRanking2 + 3,
               estadisticas: newStats2
            })

            t.update(matchesCol.doc(match.id), {
               puntos1: actualizacion,
               puntos2: 3
            })

         } else {
            // await playersCol.doc(player1.id).update({
            //    puntos: puntosRanking1 - actualizacion
            // })
            // await playersCol.doc(player2.id).update({
            //    puntos: puntosRanking2 + actualizacion
            // })
            // await matchesCol.doc(match.id).update({
            //    puntos1: -actualizacion,
            //    puntos2: actualizacion
            // })

            t.update(playersCol.doc(player1.id), {
               puntos: puntosRanking1 + 3,
               estadisticas: newStats1
            })

            t.update(playersCol.doc(player2.id), {
               puntos: puntosRanking2 + actualizacion,
               estadisticas: newStats2
            })

            t.update(matchesCol.doc(match.id), {
               puntos1: 3,
               puntos2: actualizacion
            })
         }
      })


      await db.runTransaction(async (t) => {
         // Recompute ranking using point values for each player
         const playersRefs = await t.get(playersCol)
         let players = []
         playersRefs.docs.forEach((doc) => {
            players.push(doc.data())
         })

         // Sort players by points
         players = players.sort((a, b) => b.puntos - a.puntos)

         // Update ranking for each player
         for (const player of players) {
            let rankingChanged = false
            // Check if the player has changed position
            if (player.ranking.posicion !== players.indexOf(player) + 1) {
               rankingChanged = true
            }

            // Check if the player has changed points
            if (player.ranking.puntos !== player.puntos) {
               rankingChanged = true
            }

            // Update ranking if necessary
            if (rankingChanged) {
               // Storing the current value of the player's ranking in historicoRanking
               const historicoRanking = playersCol.doc(player.id).collection('historicoRanking')

               // Add the current ranking to the historical ranking
               await historicoRanking.add({
                  fecha: match.data().fin.toDate(),
                  ...player.ranking
               })

               await t.update(playersCol.doc(player.id), {
                  ranking: {
                     puntos: player.puntos,
                     posicion: players.indexOf(player) + 1
                  }
               })
            }
         }
      })

      // Wait for the update to finish
      await new Promise(resolve => setTimeout(resolve, 100))
   }

   // let player = await playersCol.doc('alejandro-martinez').get()
   // let puntos = player.data().puntos
   // await playersCol.doc('alejandro-martinez').update({
   //    puntos: puntos - 100
   // })

   // player = await playersCol.doc('javier-perez').get()
   // puntos = player.data().puntos
   // await playersCol.doc('javier-perez').update({
   //    puntos: puntos + 50
   // })

   // player = await playersCol.doc('bastian-troncoso').get()
   // puntos = player.data().puntos
   // await playersCol.doc('bastian-troncoso').update({
   //    puntos: puntos + 50
   // })


   // await db.runTransaction(async (t) => {
   //     t.get(playersCol.doc('alejandro-martinez'))
   //     .then(async (doc) => {
   //         const puntos = doc.data().puntos
   //         console.log(puntos)
   //         await t.update(playersCol.doc('alejandro-martinez'), {
   //             puntos: puntos - 100
   //         })
   //     })
   // })

   return Response.json({ message: "Ok" })
}