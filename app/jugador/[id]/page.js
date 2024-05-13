import firestore from "@/app/models/_connection-admin";

export default async function JugadorPage({ params }) {
    const { id } = params;

    // Getting the player data
    const jugadoresRef = await firestore.collection('jugadores').doc(id).get();
    const jugador = await jugadoresRef.data();

    // Getting the player's matches
    const partidas1Ref = await firestore.collection('partidos')
                                        .where('jugador1', '==', id)

    const partidas2Ref = await firestore.collection('partidos')
                                        .where('jugador2', '==', id)

    const partidas1 = await partidas1Ref.get();
    const partidas2 = await partidas2Ref.get();

    let partidos = [...partidas1.docs, ...partidas2.docs];
    partidos = partidos.map(partida => {
        const data = partida.data();
        return {
            ...data,
            inicio: data.inicio.toDate(),
            fin: data.fin.toDate()
        }
    });

    partidos = partidos.sort((a, b) => b.fin - a.fin);

    // Statistics
    const victorias = partidos.filter(partido =>{
        if (partido.jugador1 === id) {
            return partido.puntos1 > partido.puntos2;
        } else {
            return partido.puntos2 > partido.puntos1;
        }
    })

    const puntosGanados = partidos.reduce((acc, partido) => {
        if (partido.jugador1 === id) {
            return acc + partido.puntuacion1;
        } else {
            return acc + partido.puntuacion2;
        }
    }, 0);

    const puntosPerdidos = partidos.reduce((acc, partido) => {
        if (partido.jugador1 === id) {
            return acc + partido.puntuacion2;
        } else {
            return acc + partido.puntuacion1;
        }
    }, 0);

    console.log(partidos);

    console.log(puntosGanados);
    console.log(puntosPerdidos);


    return (
        <>
            <div className="md:w-[900px] m-auto p-4">
                <div className="flex gap-4 justify-center md:justify-normal items-center">
                    <div className="w-20 h-20 bg-ping-pong-blue rounded-full"></div>
                    <span className="text-7xl text-ping-pong-blue pr-2 font-bold">#X</span>
                    <div className="flex items-center">
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-bold">
                                {jugador.nombre}</h1>
                            <h2 className="text-2xl text-slate-700">{jugador.puntos} puntos</h2>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center gap-2">
                            <span className="text-5xl font-bold text-green-700">{victorias.length}</span>
                            <span className="text-5xl text-slate-600">-</span>
                            <span className="text-5xl font-bold text-red-600">{partidos.length - victorias.length}</span>
                        </div>
                        <div className="flex justify-center gap-2">
                            <span className="text-xl text-green-700">victorias</span>
                            <span className="text-xl text-slate-600">-</span>
                            <span className="text-xl text-red-600">derrotas</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center gap-2">
                            <span className="text-5xl font-bold text-ping-pong-blue">{parseInt(victorias.length / partidos.length * 100)}%</span>
                        </div>
                        <div className="flex justify-center gap-2">
                            <span className="text-xl text-ping-pong-blue">victorias</span>

                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center gap-2">
                            <span className="text-5xl font-bold text-ping-pong-blue"> {(puntosGanados / puntosPerdidos).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-center gap-2">
                            <span className="text-xl text-ping-pong-blue">KDA</span>

                        </div>
                    </div>
                </div>
            </div>


            {/* <div className="w-[900px] m-auto p-4">
                <div className="flex gap-4  items-center">
                    <div className="w-20 h-20 bg-ping-pong-blue rounded-full"></div>
                    <div className="flex items-center">
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-bold">
                                {jugador.nombre}</h1>
                            <h2 className="text-2xl text-slate-700">{jugador.puntos} puntos</h2>
                        </div>
                    </div>
                    <span className="text-7xl text-ping-pong-blue pr-2 font-bold">#1</span>
                </div>
            </div> */}
        </>
    );
}