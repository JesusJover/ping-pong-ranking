import Title from "../components/Title";

export default function RegistrarPartido() {
   return (
      <div className="w-1/2 m-auto flex flex-col items-center p-6 gap-6">
         <Title >Registrar partido</Title>

         <form className="flex flex-col gap-3 text-sm lg:text-xl">
            <div className="flex gap-2 items-center">
               <p>Jugador 1:</p>
               <select className="p-2 bg-ping-pong-blue bg-opacity-10" name="" id="">
                  <option value="">Javier</option>
                  <option value="">Alejandro</option>
               </select>
            </div>

            <div className="flex gap-2 items-center">
               <p>Puntuación:</p>
               <input className="bg-ping-pong-blue bg-opacity-10 p-2" type="number" min={0} />
            </div>

            <hr />

            <div className="flex gap-2 items-center">
               <p>Jugador 2:</p>
               <select className="p-2 bg-ping-pong-blue bg-opacity-10" name="" id="">
                  <option value="">Javier</option>
                  <option value="">Alejandro</option>
               </select>
            </div>

            <div className="flex gap-2 items-center">
               <p>Puntuación:</p>
               <input className="bg-ping-pong-blue bg-opacity-10 p-2" type="number" min={0} />
            </div>

            <hr />

            <div className="flex gap-2 items-center">
               <p>Árbitro:</p>
               <select className="p-2 bg-ping-pong-blue bg-opacity-10" name="" id="">
                  <option value="">Javier</option>
                  <option value="">Alejandro</option>
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