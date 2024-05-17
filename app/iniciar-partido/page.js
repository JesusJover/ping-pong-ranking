'use client'

// Librerías
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Componentes
import Title from "../components/Title";
import Link from 'next/link'

export default function IniciarPartido() {
   const router = useRouter()

   const [loading, setLoading] = useState(false)
   const [loadingReg, setLoadingReg] = useState(false)

   const [players, setPlayers] = useState([])

   const [player1, setPlayer1] = useState(null)
   const [punt1, setPunt1] = useState(0)
   const [player2, setPlayer2] = useState(null)
   const [punt2, setPunt2] = useState(0)
   const [referee, setReferee] = useState(null)
   const [servePlayer, setServePlayer] = useState(1)

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

   async function iniciarPartido(e) {
      e.preventDefault()

      setLoadingReg(true)
      fetch('/api/matches', {
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

   if (players.length === 0 || loading) {
      return (
         <div className="flex h-[88vh] justify-center items-center">
            <h1 className="text-2xl">Cargando...</h1>
         </div>
      )
   }

   if (loadingReg) {
      return (
         <div className="flex h-[88vh] justify-center items-center p-5">
            <h1 className="text-2xl">Iniciando partido ...</h1>
         </div>
      )
   }

   return (
      <div className="w-3/4 md:w-1/2 m-auto flex flex-col items-center p-6 gap-6 ">
         <Title >Iniciar partido</Title>

         <form className="flex flex-col gap-3 text-sm lg:text-xl" onSubmit={e => iniciarPartido(e)}>

            <div className="flex gap-2 items-center">
               <p>Jugador 1:</p>
               <select id="player-1"
                  className="p-2 bg-slate-200"
                  onChange={(e) => {
                     setPlayer1(e.target.value)
                     if (e.target.value === player2) {
                        setPlayer2(players.filter(p => p.id !== e.target.value)[0].id)
                     }
                  }}
                  value={player1}>
                  {players.filter(p => {
                     return p.id !== player2
                  }).map((p, i) => <option key={i} value={p.id}>{p.nombre}</option>)}
               </select>
               <div onClick={() => setServePlayer(1)}>
                  {servePlayer == 1
                     ? <div className="inline-block m-1 text-xs text-white p-1 rounded bg-ping-pong-blue">PS</div>
                     : <div className="inline-block m-1 text-xs p-1 text-ping-pong-blue/70 rounded border border-ping-pong-blue/70">PS</div>
                  }
               </div>
            </div>
            <hr />
            <div className="flex gap-2 items-center">
               <p>Jugador 2:</p>
               <select id="player-2"
                  className="p-2 bg-slate-200"
                  onChange={e => {
                     setPlayer2(e.target.value)
                     if (e.target.value === player1) {
                        setPlayer1(players.filter(p => p.id !== e.target.value)[0].id)
                     }
                  }}
                  value={player2}>
                  {players.filter(p => {
                     return p.id !== player1
                  }).map((p, i) => <option key={i} value={p.id}>{p.nombre}</option>)}
               </select>
               <div onClick={() => setServePlayer(2)}>
                  {servePlayer == 2
                     ? <div className="inline-block m-1 text-xs text-white p-1 rounded bg-ping-pong-blue">PS</div>
                     : <div className="inline-block m-1 text-xs p-1 text-ping-pong-blue/70 rounded border border-ping-pong-blue/70">PS</div>
                  }
               </div>
            </div>
            <hr />
            <div className="flex gap-2 items-center">
               <p>Árbitro:</p>
               <select id="player-2"
                  className="p-2 bg-slate-200"
                  onChange={e => setReferee(e.target.value)}
                  value={referee}>
                  {players.map((p, i) => <option key={i} value={p.id}>{p.nombre}</option>)}
               </select>
            </div>
            <Link href="/partido-directo"  disabled={loadingReg} type="submit" className="bg-ping-pong-blue text-white p-2 lg:p-3 rounded-lg text-sm lg:text-xl hover:bg-opacity-45">Iniciar partido</Link>
         </form>         
      </div>
   )
}