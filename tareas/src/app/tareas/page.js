"use client"

import { useSearchParams } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"
import { useEffect, useState } from "react"

import Tarea from "@/components/Tarea"
import NuevaTarea from "@/components/NuevaTarea"

export default function tareasPage() {
    const searchParams = useSearchParams()
    const creador = searchParams.get("username") || "invitado"
    const alumnoId = searchParams.get("alumnoId")


    const { socket, isConnected } = useSocket("http://localhost:4000") //ESTE USO EN PARTICULAR.
    //PASO 2: RENOMBRAMOS isConnected A estaConectado PARA QUE SEA MAS FACIL DE COMPRENDER.
    const estaConectado = isConnected

    const [unidoASala, setUnidoASala] = useState(false)

    const [datosDeTarea, setDatosDeTarea] = useState(null) //NULO PORQUE NO RECIBIO INFORMACION.

    const [numeroPrioridad, setNumeroPrioridad] = useState("")

    const [texto, setTexto] = useState("")

    const [historial, setHistorial] = useState([])

    const unirseASala = () => {
        if (socket && alumnoId) {
            socket.emit("join_tareas", { alumnoId })
            console.log("enviando peticion para unirse a la sala: ", { alumnoId })
        } else {
            alert("Error no se puede unir a la sala, revisar conexion o alumnoId")
        }
    }

    useEffect(() => {
        if (!socket) return;

        socket.on("joined_OK_tareas", (dataInicial) => {
            console.log("Unido OK, datos de la tarea recibidos", dataInicial)
            setDatosDeTarea(dataInicial)
            setUnidoASala(true)
            setHistorial([])
        })

        socket.on("nueva_tarea", (datosDeTareaNueva) => {
            console.log("nueva tarea recibida", datosDeTareaNueva)
            setDatosDeTarea(datosDeTareaNueva)

            setHistorial((listaAnt) => {
                const nuevaLista = [datosDeTareaNueva, ...listaAnt]
                return nuevaLista.slice(0, 5)
            })
        })

        //parte de tareas completas
        socket.on("tareas_completas", (data) => {
            console.log("tareas completas", data)
            alert("Las tareas llegaron a su maximo, volvete a la sala para poder sumar mas")
            setDatosDeTarea(null)
            setUnidoASala(false)
        })



        return () => {
            socket.off("joined_OK_tareas")
            socket.off("nueva_tarea")
            socket.off("tareas_completas")
        }

    }, [socket])

    //funcion para crear una tarea

    const crearTarea = () => {
        if (!socket) return;

        const nPrioridad = parseInt(numeroPrioridad)

        if (numeroPrioridad < 1 || nPrioridad > 5) {
            alert("El numero de prioridad es erroneo, recorda que es del 1 al 5, de menor a mayor importancia")
            return;
        }

        socket.emit("crear_tarea", {
            creador: creador,
            texto: texto,
            prioridad: numeroPrioridad

        })

        setNumeroPrioridad("")

    }

    return (
        <main>

            <div style={{ border: "3px solid green", paddingBottom: "10px", marginBottom: "10px" }}>
                <h2>Crear tareas</h2>

                {/*USAMOS RENDERIZADO CONDICIONAL (TERNARIO) PARA MOSTRAR EL ESTADO DEL SOCKET*/}
                <p>Estado del socket: {estaConectado ? "CONECTADO ✅" : "DESCONECTADO ❌"}</p>  {/*ESTE RENDERIZADO CONDICIONAL FUNCIONA COMO UN IF Y UN ELSE*/}

                {/*MOSTRAMOS EL BOTON SOLO SI UNIDO A SALA ES FALSO*/}

                {!unidoASala && (
                    <button style={{ paddingBottom: "" }} onClick={unirseASala}
                        //DESHABILITA EL BOTON SI NO ESTAMOS CONECTADOS O NO HAY ID.
                        disabled={!estaConectado || !alumnoId} //EL || SIGNIFICA O
                    >

                        Unirse a sala

                    </button>
                )}
            </div>



            {unidoASala && (
                <NuevaTarea
                    texto={texto}
                    onChangePrioridad={(e) => setNumeroPrioridad(e.target.value)}
                    onChangeTarea={(e) => setTexto(e.target.value)}
                    onClickCrearTarea={crearTarea}
                    disabled={!estaConectado}
                />
            )}


            <div>
                <h3 style={{paddingBottom:"5px", paddingTop:"5px" }}>tarea actual</h3>
            </div>

            {datosDeTarea && (
                <Tarea
                    creador={datosDeTarea.creador}
                    texto={datosDeTarea.texto}
                    prioridad={datosDeTarea.prioridad}
                />
            )}

            {/*historial */}
            <div style={{ marginTop: "20px", border: "3px solid white" }}>
                <h2>Historial de las ultimas 5 tareas</h2>

                {historial.length > 0 ? (
                    //si tiene elementos usamos el .map para mostrar la lista
                    <ul>
                        {/*.map va a recorrer el array historial para cada turno en la lista y va a crear un li, una lista*/}
                        {historial.map((tarea, index) => (
                            <li key={index} style={{ border: "2px solid white", padding: "5px" }}>
                                <p>creador: {tarea.creador}</p>
                                <p>texto : {tarea.texto}</p>
                                <p>prioridad: {tarea.prioridad}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    //si no tiene historial mostramos el siguiente mensaje.
                    <p>No hay tareas</p>
                )}
            </div>


        </main>
    )
}