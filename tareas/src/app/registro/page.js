"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function registroPage() {
    const [username, setUsername] = useState("")
    const [alumnoId, setalumnoId] = useState("")
    const [apellido, setApellido] = useState("")
    const [error, setError] = useState("")


    const router = useRouter()

    const irATareas = () => {
        if (username.length < 4) {
            setError("Error, el nombre debe tener mas de 4 caracteres")
            return;
        }

        setError("")

        router.push(`/tareas?username=${username}&alumnoId=${alumnoId}`)
    }



    return (
        <main style={{ paddingLeft: "20px" }}>

            <h1>Formulario de ingreso</h1>

            <input
                type="text"
                placeholder="ingrese su nombre"
                style={{ display: "block", margin: "10px 0" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                type="text"
                placeholder="ingresa tu apellido"
                style={{ display: "block", margin: "10px 0" }}
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
            />

            <input
                type="text"
                placeholder="ingresa tu ID de alumno"
                style={{ display: "block", margin: "10px 0" }}
                value={alumnoId}
                onChange={(e) => setalumnoId(e.target.value)}
            />

            <button onClick={irATareas}>Ir a tareas</button>
        </main>
    )

}