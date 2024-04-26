function formatName(name) {
   return name.split(' ')[0] + ' ' + name.split(' ')[1].charAt(0) + '.'
}

function formatDate(date) {
   const d = new Date(date._seconds * 1000)
   return d.toLocaleDateString() + ' ' + d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
   })
}

export default function Match({ match, key }) {
   return (
      <div key={key} className="p-2 md:p-3 odd:bg-slate-200 even:bg-white grid grid-cols-3 justify-between">
         <div className={`flex-col items-start ${match.puntuacion1 > match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>
            <h3 className="text-sm md:text-sm lg:text-xl font-bold">{formatName(match.jugador1.nombre)}</h3>
            <p>{match.puntos1 > 0 ? `+${match.puntos1}` : match.puntos1}</p>
         </div>

         <div>
            <div className="flex justify-center items-center gap-2">
               <p className={`text-xl md:text-3xl font-bold ${match.puntuacion1 > match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>{match.puntuacion1}</p>
               <p>vs</p>
               <p className={`text-xl md:text-3xl font-bold ${match.puntuacion1 < match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>{match.puntuacion2}</p>
            </div>
            <p className='text-[10px] text-center text-slate-500'>{formatDate(match.fin)}</p>
         </div>

         <div className={`flex-col items-end ${match.puntuacion1 < match.puntuacion2 ? "text-green-700" : "text-red-500"}`}>
            <h3 className="text-sm md:text-sm lg:text-xl font-bold text-right">{formatName(match.jugador2.nombre)}</h3>
            <p className='text-right'>{match.puntos2 > 0 ? `+${match.puntos2}` : match.puntos2}</p>
         </div>
      </div>
   )
}