'use client';

// Librerías
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Componentes
import Title from "../components/Title";
import Link from 'next/link';

import * as Ably from 'ably';
import { AblyProvider, useChannel, useConnectionStateListener, ChannelProvider } from 'ably/react';

export default function IniciarPartido() {
   const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY, clientId: 'iniciar-partido'});

   return (
      <AblyProvider client={client}>
         <ChannelProvider channelName='marcador'>
            <IniciarPartido2 />
         </ChannelProvider>
      </AblyProvider>
      
   )
}

export function IniciarPartido2() {
   const router = useRouter();
   const { channel } = useChannel('marcador');

   const [loading, setLoading] = useState(false);

   const [players, setPlayers] = useState([]);
   const [player1, setPlayer1] = useState(null);
   const [player2, setPlayer2] = useState(null);
   const [referee, setReferee] = useState(null);

   const [servePlayer, setServePlayer] = useState(0);
   const [countdown, setCountdown] = useState(null); // stopwatch: fecha de inicio, countdown: fecha de finalización
   const [timerType, setTimerType] = useState(null); // stopwatch o countdown

   // Para recuperar los jugadores
   useEffect(() => {
      setLoading(true);
      fetch('/api/players')
         .then(data => data.json())
         .then(p => {
            setPlayers(p);
            setPlayer1(p[0].id);
            setPlayer2(p[1].id);
            setReferee(p[0].id);
            setLoading(false);
         });
   }, []);


   if (players.length === 0 || loading) {
      return (
         <div className="flex h-[88vh] justify-center items-center">
            <h1 className="text-2xl">Cargando...</h1>
         </div>
      );
   }

   const startStopwatch = () => {
      setCountdown(new Date());
      setTimerType("stopwatch");
      channel.publish('mode', 'warmup');
      channel.publish('warmup', { 
         player1: players.find(p => p.id === player1).nombre,
         player2: players.find(p => p.id === player2).nombre,
         referee: players.find(p => p.id === referee).nombre,
         countdown: new Date(),
         timerType: "stopwatch"
       });
   };

   const timedown = (duration) => {
      const countdownFinish = new Date();
      // adding duration in seconds
      countdownFinish.setSeconds(countdownFinish.getSeconds() + duration);
      setCountdown(countdownFinish);
      setTimerType("countdown");
      channel.publish('mode', 'warmup');
      channel.publish('warmup', { 
         player1: players.find(p => p.id === player1).nombre,
         player2: players.find(p => p.id === player2).nombre,
         referee: players.find(p => p.id === referee).nombre,
         countdown: countdownFinish,
         timerType: "countdown"
       });
   };
   const stopWarmup = () => {
      setCountdown(null);
      setTimerType(null);
      channel.publish('mode', 'nomatch');
   };


   return (
      <div className="w-3/4 md:w-1/2 m-auto flex flex-col items-center p-6 gap-6">
         <Title>Calentamiento</Title>
         <div className="flex flex-col items-center gap-3">
            <div className="flex justify-between w-full gap-4">
               <button onClick={startStopwatch} className="bg-ping-pong-blue text-white p-2  w-16 h-16 rounded-full hover:bg-opacity-75">Crono</button>
               <button onClick={() => timedown(120)} className="bg-ping-pong-blue text-white p-2 w-16 h-16 rounded-full hover:bg-opacity-75">2 min</button>
               <button onClick={() => timedown(300)} className="bg-ping-pong-blue text-white p-2 w-16 h-16 rounded-full hover:bg-opacity-75">5 min</button>
            </div>

            {countdown !== null && (
               <div className="text-xl font-bold">
                  <TimeWarmup time={countdown} timerType={timerType} />
               </div>
            )}

            { timerType && <button onClick={stopWarmup} className="border border-ping-pong-blue text-ping-pong-blue px-3 py-1 rounded-lg text-xs md:text-sm xl:text-xl hover:bg-ping-pong-blue hover:bg-opacity-45">Parar calentamiento</button>}
         
         </div>
         <Title>Iniciar partido</Title>

         <form className="flex flex-col gap-3 text-sm lg:text-xl" onSubmit={e => iniciarPartido(e)}>
            <div className="flex gap-2 items-center">
               <p>Jugador 1:</p>
               <select id="player-1"
                  className="p-2 bg-slate-200"
                  onChange={(e) => {
                     setPlayer1(e.target.value);
                     if (e.target.value === player2) {
                        setPlayer2(players.filter(p => p.id !== e.target.value)[0].id);
                     }
                  }}
                  value={player1}>
                  {players.filter(p => p.id !== player2).map((p, i) => <option key={i} value={p.id}>{p.nombre}</option>)}
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
                     setPlayer2(e.target.value);
                     if (e.target.value === player1) {
                        setPlayer1(players.filter(p => p.id !== e.target.value)[0].id);
                     }
                  }}
                  value={player2}>
                  {players.filter(p => p.id !== player1).map((p, i) => <option key={i} value={p.id}>{p.nombre}</option>)}
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
               <select id="referee"
                  className="p-2 bg-slate-200"
                  onChange={e => setReferee(e.target.value)}
                  value={referee}>
                  {players.map((p, i) => <option key={i} value={p.id}>{p.nombre}</option>)}
               </select>
            </div>

            { servePlayer ?
               <Link 
                  href={{
                     pathname: "/iniciar-partido/control-partido-directo",
                     query: {
                        player1,
                        player2,
                        referee,
                        servePlayer
                     }
                  }}
                  type="submit" 
                  className="bg-ping-pong-blue text-center text-white p-2 lg:p-3 rounded-lg text-sm lg:text-xl hover:bg-opacity-45">
                     Iniciar partido
               </Link>
               : 
               <p className="text-center mt-4">
                  Esperando punto de saque
               </p>
            }
               
         </form>
      </div>
   );
}

function TimeWarmup({ time, timerType }) {
   const [seconds, setSeconds] = useState(null);

   useEffect(() => {
      let interval;
      if (timerType === "stopwatch") {
         interval = setInterval(() => {
            setSeconds(parseInt((new Date() - time)/1000));
         }, 1000);
      } else if (timerType === "countdown") {
         interval = setInterval(() => {
            setSeconds(parseInt((time - new Date())/1000));
         }, 1000);
         setSeconds(parseInt((time - new Date())/1000));
      }
      return () => clearInterval(interval);
   }, [time, timerType]);

   const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
   };

   return formatTime(seconds);
}
