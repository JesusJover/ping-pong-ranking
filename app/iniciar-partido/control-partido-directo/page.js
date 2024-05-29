'use client';

// Librerías
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Componentes
import Title from "../../components/Title";

export default function ControlPartidoDirecto() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [loadingReg, setLoadingReg] = useState(false);

    const [players, setPlayers] = useState([]);
    const [player1, setPlayer1] = useState(null);
    const [scorePlayer1, setScorePlayer1] = useState(0);
    const [player2, setPlayer2] = useState(null);
    const [scorePlayer2, setScorePlayer2] = useState(0);
    const [servePlayer, setServePlayer] = useState(1);

    useEffect(() => {
        const p1 = searchParams.get('player1');
        const p2 = searchParams.get('player2');
        const serve = parseInt(searchParams.get('servePlayer'), 10);

        setPlayer1(p1);
        setPlayer2(p2);
        setServePlayer(serve);
    }, [searchParams]);

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
        const totalPoints = scorePlayer1 + scorePlayer2;
        setServePlayer(Math.floor(totalPoints / 2) % 2 === 0 ? 1 : 2);
    }, [scorePlayer1, scorePlayer2]);

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
            })
        }).then(() => {
            setLoading(false);
            router.push('/');
        });
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
            <div className="flex flex-col w-full gap-8">
                {/* Player 1 */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-around w-full gap-x-8">
                        <button type="button" onClick={() => setScorePlayer1(scorePlayer1 > 0 ? scorePlayer1 - 1 : 0)}>-</button>
                        <span>{scorePlayer1}</span>
                        <button type="button" onClick={() => setScorePlayer1(scorePlayer1 + 1)}>+</button>
                    </div>
                    <span>{players.find(p => p.id === player1)?.nombre || 'Jugador 1'}</span>
                </div>
                {/* Player 2 */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-around w-full gap-x-8">
                        <button type="button" onClick={() => setScorePlayer2(scorePlayer2 > 0 ? scorePlayer2 - 1 : 0)}>-</button>
                        <span>{scorePlayer2}</span>
                        <button type="button" onClick={() => setScorePlayer2(scorePlayer2 + 1)}>+</button>
                    </div>
                    <span>{players.find(p => p.id === player2)?.nombre || 'Jugador 2'}</span>
                </div>
            </div>
            <div>
                <p>Saque actual: {servePlayer === 1 ? players.find(p => p.id === player1)?.nombre : players.find(p => p.id === player2)?.nombre}</p>
            </div>
            <button disabled={loadingReg} type="button" onClick={registrarPartido} className="bg-ping-pong-blue text-white p-2 lg:p-3 rounded-lg text-sm lg:text-xl hover:bg-opacity-45">
                Registrar partido
            </button>
        </div>
    );
}
