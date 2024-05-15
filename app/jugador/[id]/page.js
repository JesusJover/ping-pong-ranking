import Title from "@/app/components/Title";
import firestore from "@/app/models/_connection-admin";
import Grafica from "@/app/components/Grafica";
export default async function JugadorPage({ params }) {
    const { id } = params;

    // Getting the player data
    const jugadoresRef = await firestore.collection('jugadores').get();
    const jugadorRef = await firestore.collection('jugadores').doc(id).get();
    const historicoPuntosRef = await firestore.collection('jugadores').doc(id).collection('historicoRanking').get();

    const jugador = await jugadorRef.data();
    const jugadores = jugadoresRef.docs.map(jugador => {
        return jugador.data();
    });
    let historicoPuntos = historicoPuntosRef.docs.map(historico => {
        return {
            ...historico.data(),
            fecha: historico.data().fecha.toDate()
        }
    });
    historicoPuntos = historicoPuntos.sort((a, b) => a.fecha - b.fecha);

    return (
        <>
            <div className="md:w-[900px] m-auto p-4 flex flex-col gap-10">
                <div className="flex gap-4 justify-center md:justify-normal items-center">
                    <div className="w-20 h-20 bg-ping-pong-blue rounded-full"></div>
                    <span className="text-7xl text-ping-pong-blue pr-2 font-bold">#{jugador.ranking.posicion}</span>
                    <div className="flex items-center">
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-bold">
                                {jugador.nombre}</h1>
                            <h2 className="text-2xl text-slate-700">{jugador.puntos} puntos</h2>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center gap-2">
                            <span className="text-5xl font-bold text-green-700">{jugador.estadisticas.victorias}</span>
                            <span className="text-5xl text-slate-600">-</span>
                            <span className="text-5xl font-bold text-red-600">{jugador.estadisticas.derrotas}</span>
                        </div>
                        <div className="flex justify-center gap-2">
                            <span className="text-xl text-green-700">victorias</span>
                            <span className="text-xl text-slate-600">-</span>
                            <span className="text-xl text-red-600">derrotas</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center gap-2">
                            <span className="text-5xl font-bold text-ping-pong-blue">{parseInt(jugador.estadisticas.victorias / jugador.estadisticas.partidos * 100)}%</span>
                        </div>
                        <div className="flex justify-center gap-2">
                            <span className="text-xl text-ping-pong-blue">victorias</span>

                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center gap-2">
                            <span className="text-5xl font-bold text-ping-pong-blue"> {(jugador.estadisticas.puntosGanados / jugador.estadisticas.puntosPerdidos).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-center gap-2">
                            <span className="text-xl text-ping-pong-blue">KDA</span>

                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <Title className="text-center">Head to head</Title>
                        {jugadores.map((jugador, i) => {
                            return (
                                <div key={i} className="grid grid-cols-[50%_1fr_1fr_1fr] px-2 py-3 gap-2 items-center odd:bg-slate-200 even:bg-white">
                                    <h1 className="text-xl font-bold">{jugador.nombre}</h1>
                                    <div className="flex gap-2 justify-center">
                                        <p className="text-green-700">{jugador.estadisticas.victorias}</p>
                                        <p className="text-slate-600">-</p>
                                        <p className="text-red-600">{jugador.estadisticas.derrotas}</p>
                                    </div>
                                    <p className="text-center text-ping-pong-blue">{parseInt(jugador.estadisticas.victorias / jugador.estadisticas.partidos * 100)}%</p>
                                    <p className="text-center text-ping-pong-blue">{(jugador.estadisticas.puntosGanados / jugador.estadisticas.puntosPerdidos).toFixed(2)}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-12">
                        <Title className="text-center mb-6">Evolución de puntos en el ranking</Title>
                     <Grafica data={historicoPuntos} />
                </div>
            </div>


        </>
    );
}