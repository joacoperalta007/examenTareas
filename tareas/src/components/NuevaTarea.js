"use client"


export default function NuevaTarea({ onChangeTarea, onClickCrearTarea, onChangePrioridad, disabled, texto}) {
    return (
        <div style={{ border: "3px solid blue" }}>

            <h2>Crear una nueva tarea</h2>


            <input
                type="text"
                placeholder="texto a agregar"
                value={texto}
                onChange={onChangeTarea}
                disabled={disabled}
            />

            

            <input
                type="number"
                placeholder="Nivel de prioridad, 1 al 5"
                min={1}
                max={5}
                onChange={onChangePrioridad}
                disabled={disabled}
            />

            <button onClick={onClickCrearTarea} disabled={disabled}>Crear tarea</button>
        </div>

    )
}