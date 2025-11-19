"use client"; // Necesario porque usa hooks internos (useState, useEffect)
import { useEffect, useState } from 'react'; // Importamos los hooks de React que usaremos
import io from 'socket.io-client'; // Importamos la librería cliente que instalamos

// Definimos nuestro hook personalizado. Se llama 'useSocket' y acepta la URL del servidor.
export const useSocket = (serverUrl) => {
  // --- Memoria Interna del Hook ---
  // 'useState' para guardar la conexión del socket. Empieza en 'null' (no conectado).
  const [socket, setSocket] = useState(null);
  // 'useState' para saber si estamos conectados (true) o no (false). Empieza en 'false'.
  const [isConnected, setIsConnected] = useState(false);



    // 'useEffect' ejecuta este código cuando el hook se usa por primera vez
  // o si la 'serverUrl' cambia.
  useEffect(() => {
    // Creamos la instancia del socket, intentando conectar a la URL dada.
    const socketIo = io(serverUrl);

    // Escuchador 1: Cuando se conecta exitosamente...
    socketIo.on('connect', () => {
      console.log('Socket conectado!'); // Mostramos un mensaje en consola
      setIsConnected(true); // Actualizamos el estado a 'conectado'
    });

    // Escuchador 2: Cuando se desconecta...
    socketIo.on('disconnect', () => {
      console.log('Socket desconectado!'); // Mostramos un mensaje
      setIsConnected(false); // Actualizamos el estado a 'desconectado'
    });

    // Guardamos la instancia del socket en nuestro estado 'socket'
    // para que podamos usarla desde fuera del hook.
    setSocket(socketIo);

    // --- Función de Limpieza ---
    // Esta función se ejecuta CUANDO el componente que usa el hook "desaparece".
    return () => {
      console.log('Desconectando socket...');
      socketIo.disconnect(); // Cerramos la conexión para no dejarla abierta.
    };
  }, [serverUrl]); // El array [serverUrl] controla cuándo se re-ejecuta este useEffect.

  // --- Lo que el Hook Devuelve ---
  // El hook "entrega" el objeto socket y el estado de la conexión
  // a quien lo llame.
  return { socket, isConnected };
};// src/hooks/useSocket.js

