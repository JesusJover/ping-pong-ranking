'use client'

// Librerías
import { useState, useEffect } from "react"

// Componentes
import Title from "../components/Title";

export default function RegistrarPartido() {
   const [loading, setLoading] = useState(false)

   const [players, setPlayers] = useState([])

   const [player1, setPlayer1] = useState("")
   const [punt1, setPunt1] = useState(0)
   const [player2, setPlayer2] = useState("")
   const [punt2, setPunt2] = useState(0)
   const [referee, setReferee] = useState("")

   useEffect(() => {
      setLoading(true)
      fetch('/api/players')
      .then(data => data.json())
      .then(p => {
         setPlayers(p)
         setLoading(false)
      })
   }, [])

   async function registrarPartido(e){
      e.preventDefault()

      await fetch('/api/matches',{
         method: 'POST',
         body: JSON.stringify({
            player1,
            punt1,
            player2,
            punt2,
            referee
         })
      })

   }

   if (players.length === 0 || loading){
      return (
         <h1>Cargando...</h1>
      )
   } 
   
   return (
      <div className="w-1/2 m-auto flex flex-col items-center p-6 gap-6">
         <Title >Registrar partido</Title>

         <form className="flex flex-col gap-3 text-sm lg:text-xl" onSubmit={e => registrarPartido(e)}>
            <div className="flex gap-2 items-center">
               <p>Jugador 1:</p>
               <select id="player-1" 
                  className="p-2 bg-ping-pong-blue bg-opacity-10"
                  onChange={(e) => setPlayer1(e.target.value)}
                  value={players[0].name}>
                  { players.map((p,i) => <option key={i} value={p.nombre}>{p.nombre}</option>)}
               </select>
            </div>

            <div className="flex gap-2 items-center">
               <p>Puntuación:</p>
               <input 
                  className="bg-ping-pong-blue bg-opacity-10 p-2" 
                  type="number" 
                  min={0} 
                  value={punt1}
                  onChange={e => setPunt1(e.target.value)}
                  />
            </div>

            <hr />

            <div className="flex gap-2 items-center">
               <p>Jugador 2:</p>
               <select id="player-2" 
                  className="p-2 bg-ping-pong-blue bg-opacity-10"
                  onChange={e => setPlayer2(e.target.value)}
                  value={player1 !== players[1].name ? players[1].name : players[0].name}>
                  { players.filter(p =>{
                     return p.nombre !== player1
                  }).map((p,i) => <option key={i} value={p.nombre}>{p.nombre}</option>)}
               </select>
            </div>

            <div className="flex gap-2 items-center">
               <p>Puntuación:</p>
               <input 
                  className="bg-ping-pong-blue bg-opacity-10 p-2" 
                  type="number" 
                  min={0} 
                  value={punt2}
                  onChange={e => setPunt2(e.target.value)}
                  />
            </div>

            <hr />

            <div className="flex gap-2 items-center">
               <p>Árbitro:</p>
               <select id="player-2" 
                  className="p-2 bg-ping-pong-blue bg-opacity-10"
                  onChange={e => setReferee(e.target.value)}
                  value={player1}>
                  { players.map((p,i) => <option key={i} value={p.nombre}>{p.nombre}</option>)}
               </select>
            </div>

            <div>
            <div className="flex gap-2 items-center">
                  <p>Fecha y hora:</p>
                  <input type="datetime-local" 
                     className="bg-ping-pong-blue bg-opacity-10 p-2" 
                     defaultValue={new Date().toISOString().slice(0, 16)}
                  />
               </div>
            </div>

            <button type="submit" className="bg-ping-pong-blue text-white p-3 rounded-lg text-xl hover:bg-opacity-45">Registrar partido</button>
         </form>
      </div>
   )
}