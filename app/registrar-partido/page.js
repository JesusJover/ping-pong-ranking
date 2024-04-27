'use client'

// Librerías
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Componentes
import Title from "../components/Title";

export default function RegistrarPartido() {
   const router = useRouter()

   const [loading, setLoading] = useState(false)
   const [loadingReg, setLoadingReg] = useState(false)

   const [players, setPlayers] = useState([])

   const [player1, setPlayer1] = useState(null)
   const [punt1, setPunt1] = useState(0)
   const [player2, setPlayer2] = useState(null)
   const [punt2, setPunt2] = useState(0)
   const [referee, setReferee] = useState(null)

   useEffect(() => {
      setLoading(true)
      fetch('/api/players')
      .then(data => data.json())
      .then(p => {
         setPlayers(p)
         setPlayer1(p[0].id)
         setPlayer2(p[1].id)
         setReferee(p[0].id)
         setLoading(false)
      })
   }, [])

   async function registrarPartido(e){
      e.preventDefault()

      setLoadingReg(true)
      fetch('/api/matches',{
         method: 'POST',
         body: JSON.stringify({
            player1,
            punt1,
            player2,
            punt2,
            referee
         })
      }).then(() => {
         setLoading(false)
         router.push('/')
      })

   }

   if (players.length === 0 || loading){
      return (
         <div className="flex h-[88vh] justify-center items-center">
            <h1 className="text-2xl">Cargando...</h1>
         </div>
      )
   }

   if (loadingReg){
      return (
         <div className="flex h-[88vh] justify-center items-center p-5">
            <h1 className="text-2xl">Registrando partido ...</h1>
         </div>
      )
   }
   
   return (
      <div className="w-3/4 md:w-1/2 m-auto flex flex-col items-center p-6 gap-6">
         <Title >Registrar partido</Title>

         <form className="flex flex-col gap-3 text-sm lg:text-xl" onSubmit={e => registrarPartido(e)}>
            <div className="flex gap-2 items-center">
               <p>Jugador 1:</p>
               <select id="player-1" 
                  className="p-2 bg-slate-200"
                  onChange={(e) => {
                     setPlayer1(e.target.value)
                     if (e.target.value === player2){
                        setPlayer2(players.filter(p => p.id !== e.target.value)[0].id)
                     }
                  }}
                  value={player1}>
                  { players.filter(p => {
                     return p.id !== player2
                  }).map((p,i) => <option key={i} value={p.id}>{p.nombre}</option>)}
               </select>
            </div>

            <div className="flex gap-2 items-center">
               <p>Puntuación:</p>
               <input 
                  className="bg-slate-200 p-2 w-16" 
                  type="number" 
                  min={0} 
                  value={punt1}
                  onChange={e => setPunt1(e.target.value)}
                  />
               <button type="button" className="border py-[7px] w-[35px] bg-slate-200"
                  onClick={() => punt1 >0 && setPunt1(punt1-1)}>-</button>
               <button type="button" className="border py-[7px] w-[35px] bg-slate-200"
                  onClick={() => setPunt1(punt1+1)}>+</button>
            </div>

            <hr />

            <div className="flex gap-2 items-center">
               <p>Jugador 2:</p>
               <select id="player-2" 
                  className="p-2 bg-slate-200"
                  onChange={e => {
                     setPlayer2(e.target.value)
                     if (e.target.value === player1){
                        setPlayer1(players.filter(p => p.id !== e.target.value)[0].id)
                     } 
                  }}
                  value={player2}>
                  { players.filter(p =>{
                     return p.id !== player1
                  }).map((p,i) => <option key={i} value={p.id}>{p.nombre}</option>)}
               </select>
            </div>

            <div className="flex gap-2 items-center">
               <p>Puntuación:</p>
               <input 
                  className="bg-slate-200 p-2 w-16" 
                  type="number" 
                  min={0} 
                  value={punt2}
                  onChange={e => setPunt2(e.target.value)}
                  />
               <button type="button" className="border py-[7px] w-[35px] bg-slate-200"
                  onClick={() => punt2 >0 && setPunt2(punt2-1)}>-</button>
               <button type="button" className="border py-[7px] w-[35px] bg-slate-200"
                  onClick={() => setPunt2(punt2+1)}>+</button>
            </div>

            <hr />

            <div className="flex gap-2 items-center">
               <p>Árbitro:</p>
               <select id="player-2" 
                  className="p-2 bg-slate-200"
                  onChange={e => setReferee(e.target.value)}
                  value={referee}>
                  { players.map((p,i) => <option key={i} value={p.id}>{p.nombre}</option>)}
               </select>
            </div>

            <div>
            <div className="flex gap-2 items-center">
                  <p>Fecha:</p>
                  <input type="datetime-local" 
                     className="bg-slate-200 p-2" 
                     defaultValue={new Date().toISOString().slice(0, 16)}
                  />
               </div>
            </div>

            <button disabled={loadingReg} type="submit" className="bg-ping-pong-blue text-white p-2 lg:p-3 rounded-lg text-sm lg:text-xl hover:bg-opacity-45">Registrar partido</button>
         </form>
      </div>
   )
}