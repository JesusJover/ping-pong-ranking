export default function Leaderboard () {
   const players = [
      {name: 'Alejandro Martínez', points: 6000},
      {name: 'Jesús Martínez', points: 5000},
      {name: 'Jorge Martínez', points: 4000},
      {name: 'Javier Pérez', points: 7800},
      {name: 'Henar Velasco', points: 2000},
      {name: 'Juan Martínez', points: 1000},
   ]

   const playersSorted = players.sort((a, b) => b.points - a.points)

   return(
      <div className="w-full h-full flex flex-col lg:justify-center items-center gap-5">
         <h1 className="text-3xl font-bold">Clasificación</h1>
         <div className="w-[90%] lg:w-[70%] border">
            { playersSorted.map((player, index) => ( 
               <div key={index} className="flex text-lg lg:text-2xl justify-between p-2 px-4 lg:py-3 lg:px-4 odd:bg-slate-200 even:bg-white">
                  <p className="font-bold w-[10%]">{index+1}</p>
                  <p className="w-[68%]">{player.name}</p>
                  <p className="lg:w-[22%]">{player.points} <span className="text-sm lg:text-xl">pts</span></p>
               </div>
            )
            )}
         </div>
      </div>
   )
}