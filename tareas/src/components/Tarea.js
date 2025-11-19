
export default function Tarea({texto, prioridad, creador}){
    return(
        <div style={{border:"2px solid white"}}>
            <h3>texto: {texto}</h3>
            <h3>prioridad: {prioridad > 3 ? "Prioridad alta" : "Prioridad normal"}</h3>
            <h3>creador: {creador}</h3>
        </div>
    )
}