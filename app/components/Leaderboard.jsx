
import db from '../models/_connection-admin'

// Components
import Title from './Title'

export default async function Leaderboard () {
   // Code example to get data from Firestore
   const { docs, size } = await db.collection('jugadores').get()
   let players = docs.map(doc => doc.data())
   players = arreglarPlayers(players)
   

   const playersSorted = players.sort((a, b) => b.puntos - a.puntos) 

   return(
      <div className="w-full h-full flex flex-col lg:justify-center items-center gap-5">
         <Title>Clasificación</Title>
         <div className="w-[90%] lg:w-[70%] border">
            { playersSorted.map((player, index) => ( 
               <div key={index} className="flex text-lg lg:text-2xl justify-between p-2 px-4 lg:py-3 lg:px-4 odd:bg-slate-200 even:bg-white">
                  <p className="font-bold w-[10%]">{ index==0?'1🥇':index==1?'2🥈':index==2?'3🥉':index+1}</p>
                  <p className="w-[68%]">{player.nombre}</p>
                  <p className="lg:w-[22%]">{player.puntos} <span className="text-sm lg:text-xl">pts</span></p>
               </div>
            )
            )}
         </div>
      </div>
   )
}
//🥇 🥈 🥉 {index == 0 &&<p>🥇</p>}{index == 1 &&<p>🥈</p>}{index == 2 &&<p>🥉</p>}


function arreglarPlayers(players){
   

   players.forEach(element => {
      if (element.nombre == 'Javier Pérez'){
         element.nombre = "Javier 'El Duketo' Pérez"
         element.puntos = element.puntos*10
      }
      else if (element.nombre == 'Kike Arias'){
         element.nombre = "Kike 'El Jefe' Arias"
         element.puntos = 101
      }
      else if (element.nombre == 'Alejandro Martínez'){
         element.puntos = element.puntos/10
      }
      else{
         // Array con las palabras aleatorias
         var palabrasAleatorias = [' Bobo', ' Bobin', ' Panoli'];
         element.nombre = element.nombre + palabrasAleatorias[Math.floor(Math.random() * palabrasAleatorias.length)]
         element.puntos = Math.floor(Math.random() * 100) + 1

      }
   });

   players.push({
      nombre: 'Duki',
      puntos: 1000000
   })
   
   return players
}