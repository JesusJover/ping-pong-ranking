import db from '../models/_connection-admin'

export default async function LastMatches() {
   const { docs } = await db.collection('partidos').orderBy('fin', 'desc').limit(5).get()
   const matches = docs.map(doc => doc.data())

   return (
      <div className="w-full h-full flex flex-col lg:justify-center items-center gap-5">
            <h1 className="text-3xl font-bold">Últimos partidos</h1>
            <div className="w-[90%] lg:w-[80%]"> 
            { matches.map((match, index) => 
               <div key={index} className="p-3 odd:bg-slate-200 even:bg-white
                  grid grid-cols-3 justify-between">
                  <div className={`flex-col items-start ${match.puntuacion1 > match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>
                     <h3 className="text-xl font-bold">{match.jugador1}</h3>
                     <p>{match.puntos1}</p>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                     <p className={`text-3xl font-bold ${match.puntuacion1 > match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>{match.puntuacion1}</p>
                     <p>vs</p>
                     <p className={`text-3xl font-bold ${match.puntuacion1 < match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>{match.puntuacion2}</p>
                  </div>

                 <div className={`flex-col items-end ${match.puntuacion1 < match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>
                     <h3 className="text-xl font-bold text-right">{match.jugador2}</h3>
                     <p className='text-right'>{match.puntos2}</p>
                 </div>
               </div>
               )
            }
            </div>
      </div>
   )
}