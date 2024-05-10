import db from '../../models/_connection-admin'

export async function GET(req, res) {
    const matchesCol = db.collection('partidos')
    const playersCol = db.collection('jugadores')

    const playersRefs = await playersCol.get()
    playersRefs.docs.forEach(async (doc) => {
        // Update document
        await playersCol.doc(doc.id).update({
            puntos: 1000
        })
    })

    const matchesRefs = await matchesCol.orderBy('fin', 'asc').get()
    //matchesRefs.docs.forEach( async (match) => {
    for (const match of matchesRefs.docs) {
        const player1 = await playersCol.doc(await match.data().jugador1).get()
        const player2 = await playersCol.doc(await match.data().jugador2).get()

        const puntosRanking1 = player1.data().puntos
        const puntosRanking2 = player2.data().puntos
        const puntuacion1 = match.data().puntuacion1
        const puntuacion2 = match.data().puntuacion2

        let prob
        if (puntuacion1 > puntuacion2) {
            prob = puntosRanking2 / (puntosRanking1 + puntosRanking2)
        } else {
            prob = puntosRanking1 / (puntosRanking1 + puntosRanking2)
        }

        const KDiff = 20
        const KRanking = 18
        const diffPuntos = (Math.abs(puntuacion1 - puntuacion2)-1)/10
        // const actualizacion = parseInt(K * prob * diffPuntos)
        //const actualizacionRanking = prob * KRanking
        const actualizacionRanking = (prob > 0.5 ? (10 + (prob - 0.5) * 180) : prob * 20)
        const actualizacionDiferencia = 0 // prob * diffPuntos * KDiff
        const actualizacion = parseInt(actualizacionRanking + actualizacionDiferencia)
        console.log("Actualizacion: " + actualizacion + " Ranking: " + actualizacionRanking + " Diferencia: " + actualizacionDiferencia + " Prob: " + prob + " Puntos1: " + puntuacion1 + " Puntos2: " + puntuacion2 + " PuntosRanking1: " + puntosRanking1 + " PuntosRanking2: " + puntosRanking2)

        if (puntuacion1 > puntuacion2) {
            await playersCol.doc(player1.id).update({
                puntos: puntosRanking1 + actualizacion
            })
            await playersCol.doc(player2.id).update({
                puntos: puntosRanking2 - actualizacion
            })
            await matchesCol.doc(match.id).update({
                puntos1: actualizacion,
                puntos2: -actualizacion
            })
        } else {
            await playersCol.doc(player1.id).update({
                puntos: puntosRanking1 - actualizacion
            })
            await playersCol.doc(player2.id).update({
                puntos: puntosRanking2 + actualizacion
            })
            await matchesCol.doc(match.id).update({
                puntos1: -actualizacion,
                puntos2: actualizacion
            })
        }

        // Wait for the update to finish
        await new Promise(resolve => setTimeout(resolve, 500))
    }

    let player = await playersCol.doc('alejandro-martinez').get()
    let puntos = player.data().puntos
    await playersCol.doc('alejandro-martinez').update({
        puntos: puntos - 100
    })

    player = await playersCol.doc('javier-perez').get()
    puntos = player.data().puntos
    await playersCol.doc('javier-perez').update({
        puntos: puntos + 50
    })

    player = await playersCol.doc('bastian-troncoso').get()
    puntos = player.data().puntos
    await playersCol.doc('bastian-troncoso').update({
        puntos: puntos + 50
    })


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

    return Response.json({ message: "Ok"})
}