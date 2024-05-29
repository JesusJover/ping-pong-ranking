'use client';

// Librerías
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Componentes
import Title from "../../components/Title";


import * as Ably from 'ably';
import { AblyProvider, useChannel, useConnectionStateListener, ChannelProvider } from 'ably/react';

export default function IniciarPartido() {
   const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY, clientId: 'iniciar-partido'});

   return (
      <AblyProvider client={client}>
         <ChannelProvider channelName='marcador'>
            <Suspense fallback={<div>Cargando...</div>}>
               <ControlPartidoDirecto />
            </Suspense>
         </ChannelProvider>
      </AblyProvider>
      
   )
}

export function ControlPartidoDirecto() {
   const router = useRouter();
   const { channel } = useChannel('marcador');

    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [loadingReg, setLoadingReg] = useState(false);

    const [players, setPlayers] = useState([]);
    const [player1, setPlayer1] = useState(searchParams.get('player1') || null);
    const [scorePlayer1, setScorePlayer1] = useState(0);
    const [player2, setPlayer2] = useState(searchParams.get('player2') || null);
    const [scorePlayer2, setScorePlayer2] = useState(0);
    const [referee, setReferee] = useState(searchParams.get('referee') || null);
    const [servePlayer, setServePlayer] = useState(parseInt(searchParams.get('servePlayer')) || 1);
   const initServe = parseInt(searchParams.get('servePlayer')) || 1;
    const [inicio, setInicio] = useState(new Date());

   //  useEffect(() => {
   //      const p1 = searchParams.get('player1');
   //      const p2 = searchParams.get('player2');
   //      const serve = parseInt(searchParams.get('servePlayer'), 10);

   //      setPlayer1(p1);
   //      setPlayer2(p2);
   //      setServePlayer(serve);
   //  }, [searchParams]);

   channel.publish('mode', 'match');

    useEffect(() => {
        setLoading(true);
        fetch('/api/players')
            .then(data => data.json())
            .then(p => {
                setPlayers(p);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
         if (players.length == 0) return;
        const totalPoints = scorePlayer1 + scorePlayer2;

        let newServe
        if (totalPoints < 20) {
         newServe = Math.floor(totalPoints/2) % 2 === 0 ? 1 : 2
        } else {
         newServe = Math.floor(totalPoints) % 2 === 0 ? 1 : 2
        }
        
        if (initServe === 2) {
            newServe = newServe === 1 ? 2 : 1;
        }
        setServePlayer(newServe);

         channel.publish('infoPartido', {
            player1: players.find(p => p.id === player1).nombre,
            player2: players.find(p => p.id === player2).nombre,
            referee: players.find(p => p.id === referee).nombre,
            servePlayer: newServe,
            punt1: scorePlayer1,
            punt2: scorePlayer2,
            inicio
         });
        
    }, [scorePlayer1, scorePlayer2, players]);

    async function registrarPartido(e) {
        e.preventDefault();

        setLoadingReg(true);
        fetch('/api/matches', {
            method: 'POST',
            body: JSON.stringify({
                player1,
                punt1: scorePlayer1,
                player2,
                punt2: scorePlayer2,
               referee: player1,
               inicio,
               fin: new Date()
            })
        }).then(() => {
            setLoading(false);
            router.push('/');
        });
    }

    function matchFinished() {
      // Checks if the match is finished (11 points and 2 points of difference)
      return (scorePlayer1 >= 11 || scorePlayer2 >= 11) && Math.abs(scorePlayer1 - scorePlayer2) >= 2;

    }

    if (loading) {
        return (
            <div className="flex h-[88vh] justify-center items-center">
                <h1 className="text-2xl">Cargando...</h1>
            </div>
        );
    }

    if (loadingReg) {
        return (
            <div className="flex h-[88vh] justify-center items-center p-5">
                <h1 className="text-2xl">Registrando partido...</h1>
            </div>
        );
    }

    return (
        <div className="w-3/4 md:w-1/2 m-auto flex flex-col items-center p-6 gap-6">
            <Title>Marcador</Title>
            <div className="flex flex-col w-full gap-12">
                {/* Player 1 */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-around w-full gap-x-8">
                        <button type="button" className="bg-ping-pong-blue text-xl text-white  w-12 rounded-lg" onClick={() => setScorePlayer1(scorePlayer1 > 0 ? scorePlayer1 - 1 : 0)}>-</button>
                        <span className="text-6xl">{scorePlayer1}</span>
                        <button type="button" className="bg-ping-pong-blue text-xl text-white  w-12 rounded-lg" onClick={() => setScorePlayer1(scorePlayer1 + 1)}>+</button>
                    </div>
                    <span>{players.find(p => p.id === player1)?.nombre || 'Jugador 1'}</span>
                </div>

                <hr className="w-full border-1 border-ping-pong-blue" />

                {/* Player 2 */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-around w-full gap-x-8">
                        <button type="button" className="bg-ping-pong-blue text-xl text-white  w-12 rounded-lg" onClick={() => setScorePlayer2(scorePlayer2 > 0 ? scorePlayer2 - 1 : 0)}>-</button>
                        <span className="text-6xl">{scorePlayer2}</span>
                        <button type="button" className="bg-ping-pong-blue text-xl text-white  w-12 rounded-lg" onClick={() => setScorePlayer2(scorePlayer2 + 1)}>+</button>
                    </div>
                    <span>{players.find(p => p.id === player2)?.nombre || 'Jugador 2'}</span>
                </div>
            </div>
            <div>
                <p>Saque actual: {servePlayer === 1 ? players.find(p => p.id === player1)?.nombre : players.find(p => p.id === player2)?.nombre}</p>
            </div>

         {  matchFinished() && 
            <button disabled={loadingReg} type="button" onClick={registrarPartido} className="bg-ping-pong-blue text-white p-2 lg:p-3 rounded-lg text-sm lg:text-xl hover:bg-opacity-45">
                Registrar partido
            </button>
         }
        </div>
    );
}
