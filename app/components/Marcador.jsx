'use client'
import { useState, useEffect } from "react"
import * as Ably from 'ably';
import { AblyProvider, useChannel, useConnectionStateListener, ChannelProvider } from 'ably/react';

export default function Marcador() {
   // Creamos el cliente de Ably
   const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY, clientId: 'Marcador' });

   return (
      <AblyProvider client={client}>
         <ChannelProvider channelName='marcador'>
            <AblyPubSub />
         </ChannelProvider>
      </AblyProvider>
   );
}

function AblyPubSub() {
   const [mode, setMode] = useState('nomatch');
   const [warmup, setWarmup] = useState({});

   // Información del partido en curso
   const [ partido , setPartido ] = useState({
      player1: 'Jugador 1',
      player2: 'Jugador 2',
      punt1: 0,
      punt2: 0,
      servePlayer: 0,
      referee: 'Árbitro',
      inicio: new Date()
   })


   useConnectionStateListener('connected', () => {
      console.log('Conectado con el canal de mensajes');
   });

   const { channel } = useChannel('marcador', 'infoPartido' ,(message) => {
      setPartido({
         ...message.data,
         inicio: new Date(message.data.inicio)
      });
   });

   const { channel: channel2 } = useChannel('marcador', 'mode', (message) => {
      setMode(message.data);
   });

   const { channel: channel3 } = useChannel('marcador', 'warmup', (message) => {
      setWarmup(message.data);
   });


   if (mode === 'nomatch') {
      return <NoMatch />
   }

   if (mode === 'warmup') {
      return <WarmUp warmup={warmup} />
   }

   if (mode === 'match') {
      return <Match partido={partido} />
   }
}

function NoMatch() {
   
}

function WarmUp({ warmup }) {
   const [seconds, setSeconds] = useState(null);
   const timerType = warmup.timerType;
   const time = new Date(warmup.countdown);

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
   }, [warmup]);

   const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
   };

   return (
      <div className='flex flex-col gap-5 justify-around items-center w-full h-[84vh]'>
         <h1 className="text-[200px] font-bold text-ping-pong-blue">{formatTime(seconds)}</h1>
         <div className="w-full flex justify-around items-center text-4xl gap-8 text-bold text-slate-700">
            <h2>{ warmup.player1} </h2>
            <h2>{ warmup.player2} </h2>
         </div>
      </div>
   )
}

function Match({ partido }) {
   let matchPoint = false
   // If the score is at least 10 points and the difference is at least 1 point
   if (partido.punt1 >= 10 && partido.punt1 - partido.punt2 >= 1) {
      matchPoint = partido.player1
   } else if (partido.punt2 >= 10 && partido.punt2 - partido.punt1 >= 1) {
      matchPoint = partido.player2
   }

   //Compute winner if the score is at least 11 points and the difference is at least 2 points
   let winner = false
   if (partido.punt1 >= 11 && partido.punt1 - partido.punt2 >= 2) {
      winner = partido.player1
   } else if (partido.punt2 >= 11 && partido.punt2 - partido.punt1 >= 2) {
      winner = partido.player2
   }

   return (
      <div className='flex flex-col justify-between w-full h-[84vh]'>
         <div>
            <AutoUploadDate inicio={partido.inicio} />
         </div>

         {matchPoint && !winner &&
            <div className="flex gap-4 justify-center text-5xl font-bold text-center text-red-400">
               <IconPingPong />
               <h1>
                  PUNTO DE PARTIDO
               </h1>
               <IconPingPong />
            </div>
         }

         <div className='grid justify-center items-center grid-cols-[auto_100px_auto] text-ping-pong-blue'>
            <div className={`flex flex-col items-center ${winner === partido.player1 && "text-green-600"} `}>
               <h1 className='text-[300px] font-bold text-right leading-none'>{partido.servePlayer === 1 && "*"}{partido.punt1}</h1>
               <h3 className='text-4xl'>{partido.player1}</h3>
            </div>
            <h1 className='text-8xl text-center'>-</h1>
            <div className={`flex flex-col items-center ${winner === partido.player2 && "text-green-600"}`}>
               <h1 className='text-[300px] font-bold text-left leading-none'>{partido.punt2}{partido.servePlayer === 2 && "*"}</h1>
               <h3 className='text-4xl'>{partido.player2}</h3>
            </div>
         </div>
         <div className="flex flex-col items-center">

            <h2 className="text-3xl text-center text-slate-600">{partido.referee}</h2>
            <h4 className="text-xl text-slate-400">Árbitro</h4>
         </div>
      </div>);
}


function AutoUploadDate({inicio}) {
   const [ date, setDate ] = useState(new Date());

   useEffect(() => {
      const interval = setInterval(() => {
         setDate(new Date());
      }, 1000);
      return () => clearInterval(interval);
   }, []);

   const diff = Math.floor((date - inicio) / 1000);
   // Format the time in mm:ss
   const minutes = Math.floor(diff / 60);
   const seconds = diff % 60;
   return <h1 className='p-5 text-5xl text-center text-slate-500'>
      {minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}
      :
      {seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}
      </h1>
}

function IconPingPong(props) {
   return (
     <svg
       fill="none"
       stroke="currentColor"
       strokeLinecap="round"
       strokeLinejoin="round"
       strokeWidth={2}
       viewBox="0 0 24 24"
       height="1em"
       width="1em"
       {...props}
     >
       <path stroke="none" d="M0 0h24v24H0z" />
       <path d="M12.718 20.713a7.64 7.64 0 01-7.48-12.755l.72-.72a7.643 7.643 0 019.105-1.283L17.45 3.61a2.08 2.08 0 013.057 2.815l-.116.126-2.346 2.387a7.644 7.644 0 01-1.052 8.864" />
       <path d="M17 18 A3 3 0 0 1 14 21 A3 3 0 0 1 11 18 A3 3 0 0 1 17 18 z" />
       <path d="M9.3 5.3l9.4 9.4" />
     </svg>
   );
 }