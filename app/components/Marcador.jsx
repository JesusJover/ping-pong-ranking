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
         <div className='grid justify-center items-center grid-cols-[auto_100px_auto] text-ping-pong-blue'>
            <div className='flex flex-col items-center'>
               <h1 className='text-[300px] font-bold'>{partido.punt1}</h1>
               <h3 className='text-4xl'>{partido.player1}</h3>
            </div>
            <h1 className='text-8xl text-center'>-</h1>
            <div className='flex flex-col items-center'>
               <h1 className='text-[300px] font-bold'>{partido.punt2}</h1>
               <h3 className='text-4xl'>{partido.player2}</h3>
            </div>
         </div>
         <div>
            <h2 className="text-4xl pt-5 pb-3 text-center text-slate-600">{partido.referee}</h2>
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