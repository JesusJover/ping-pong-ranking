'use client'
import Plot from "react-plotly.js";

export default function Grafica({ data }) {
    const x = data.map(d => d.fecha)
    const y = data.map(d => d.puntos)

    return (
        <Plot
            className="w-full"
            data={[
                {
                    x,
                    y,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { color: 'red' },
                }
            ]}
            layout={{ width: "100%", height: 500, margin: { t: 0 , r: 0, l: 0, b: 0}}}
        />
    )
}

