export async function ComputePlayerStatistics(playerId, partido, estadisticaAnterior) {
    const nuevasEstadisticas = {
        ...estadisticaAnterior
    }

    if (partido.jugador1 === playerId){
        nuevasEstadisticas.partidos++
        nuevasEstadisticas.puntosGanados += partido.puntuacion1
        nuevasEstadisticas.puntosPerdidos += partido.puntuacion2
        // nuevasEstadisticas.puntos += partido.puntos1

        if (partido.puntuacion1 > partido.puntuacion2){
            nuevasEstadisticas.victorias++
        } else {
            nuevasEstadisticas.derrotas++
        }
    } else {
        nuevasEstadisticas.partidos++
        nuevasEstadisticas.puntosGanados += partido.puntuacion2
        nuevasEstadisticas.puntosPerdidos += partido.puntuacion1
        // nuevasEstadisticas.puntos += partido.puntos2

        if (partido.puntuacion2 > partido.puntuacion1){
            nuevasEstadisticas.victorias++
        } else {
            nuevasEstadisticas.derrotas++
        }
    }

    return nuevasEstadisticas
}