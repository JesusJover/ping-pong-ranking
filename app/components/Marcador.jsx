'use client'
import { useState, useEffect } from "react"
import * as Ably from 'ably';
import { AblyProvider, useChannel, useConnectionStateListener, ChannelProvider } from 'ably/react';

export default function Marcador() {
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
   const [ partido , setPartido ] = useState({
      player1: 'Jugador 1',
      player2: 'Jugador 2',
      punt1: 0,
      punt2: 0,
      referee: 'Árbitro',
      inicio: new Date()
   })

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

   console.log(winner)


      useConnectionStateListener('connected', () => {
         console.log('Conectado con el canal de mensajes');
      });

      const { channel } = useChannel('marcador', 'prueba' ,(message) => {
         console.log('Mensaje recibido:', message.data);
         setPartido({
            ...message.data,
            inicio: new Date(message.data.inicio)
         });
      });


   return (
      <div className='flex flex-col justify-between w-full h-[84vh]'>
         <div>
            <AutoUploadDate inicio={partido.inicio} />
         </div>

         { matchPoint && !winner &&
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
               <h1 className='text-[300px] font-bold text-right leading-none'>{partido.punt1}</h1>
               <h3 className='text-4xl'>{partido.player1}</h3>
            </div>
            <h1 className='text-8xl text-center'>-</h1>
            <div className={`flex flex-col items-center ${winner === partido.player2 && "text-green-600"}`}>
               <h1 className='text-[300px] font-bold text-left leading-none'>{partido.punt2}</h1>
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