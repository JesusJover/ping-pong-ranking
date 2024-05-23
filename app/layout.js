import Image from 'next/image'
import "./globals.css"
import { Inter } from 'next/font/google'
import Link from 'next/link';

export const metadata = {
  title: "Ping-Pong Retics",
  description: "Ping-Pong Retics es una liga de ping-pong en la que los jugadores compiten por ser el mejor jugador de la liga.",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {

  return (
    <html lang="es">
      <body className={inter.className}>
         <header className='h-[12vh] bg-slate-100 overflow-hidden flex justify-center p-5'>
            <Link href='/'>
               <Image className='h-full' src="/logos/ping-pong-retics.svg" alt="logo" width={900} height={600}/>
            </Link>
         </header>
         {/* <AblyProvider client={client}> */}
            {children}
         {/* </AblyProvider> */}
      </body>
    </html>
  );
}
