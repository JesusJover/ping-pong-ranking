import db from './_connection-admin'

export async function ComputeMatchStatistics(match) {
    // match = {
    //     jugador1: body.player1,
    //     puntuacion1: parseInt(body.punt1),
    //     jugador2: body.player2,
    //     puntuacion2: parseInt(body.punt2),
    //     arbitro: body.referee,
    //     inicio: new Date(),
    //     fin: new Date()
    //  }

    // Coleccion de partidos
    const matchesCol = db.collection('partidos')
    const playersCol = db.collection('jugadores')

    // Obtener los datos sobre los jugadores
    const player1 = await playersCol.doc(match.jugador1).get()
    const player2 = await playersCol.doc(match.jugador2).get()

    // Puntos del ranking de los dos jugadores actualmente
    const puntosRanking1 = player1.data().puntos
    const puntosRanking2 = player2.data().puntos

    // Puntos del partido
    const puntuacion1 = match.puntuacion1
    const puntuacion2 = match.puntuacion2

    let prob
    if (puntuacion1 > puntuacion2) {
        // Probabilidad de que gane el jugador 2, se le aplica al 1
        prob = puntosRanking2 / (puntosRanking1 + puntosRanking2)
    } else {
        // Probabilidad de que gane el jugador 1, se le aplica al 2
        prob = puntosRanking1 / (puntosRanking1 + puntosRanking2)
    }

    // Calculo de puntuación aportada por el partido
    const KDiff = 1
    const KRanking = 18
    const diffPuntos = (Math.abs(puntuacion1 - puntuacion2) - 1) / 10
    const actualizacionRanking = (prob > 0.5 ? (10 + (prob - 0.5) * 180) : prob * 20)
    const actualizacionDiferencia = (prob > 0.5 ? (10 + (prob - 0.5) * 10) : prob * 10) * diffPuntos * KDiff
    const actualizacion = parseInt(actualizacionRanking + actualizacionDiferencia)

    // TODO: Guardar las estadisticas actuales

    // Actualización de los puntos de los jugadores y del partido
    if (puntuacion1 > puntuacion2) {
        await playersCol.doc(player1.id).update({
            puntos: puntosRanking1 + actualizacion
        })
        await playersCol.doc(player2.id).update({
            puntos: puntosRanking2 - actualizacion
        })
        await matchesCol.add({
            ...match,
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
        await matchesCol.add({
            ...match,
            puntos1: -actualizacion,
            puntos2: actualizacion
        })
    }

    return {
        ...match,
        puntos1: -actualizacion,
        puntos2: actualizacion
    }
}