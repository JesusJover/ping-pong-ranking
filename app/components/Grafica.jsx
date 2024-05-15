'use client'
import Plot from "react-plotly.js";

export default function Grafica({ data }) {
    const x = data.map(d => d.fecha)
    const y = data.map(d => d.puntos)

    return (
      <div className="w-full h-[400px]">
         <Plot
            className="w-full h-full"
            data={[
                {
                    x,
                    y,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { color: 'red' },
                }
            ]}
            layout={{
               autosize: true,
               margin: { t: 0 },
            }}
        />
      </div>
    )
}

