// server.js (Servidor Simulado para el Examen de Tareas)
const httpServer = require("http").createServer();
const io = new require("socket.io")(httpServer, { cors: { origin: "*" } });

console.log("Servidor SIMULADO de Tareas iniciado...");

// --- Datos de ejemplo que simulan la base de datos ---
let cantidadTareasTotal = 0;

// --- Lógica de Socket.IO ---
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado:', socket.id);

  // --- Oyente para 'join_tareas' ---
  // Escucha cuando un cliente intenta unirse a una sala
  socket.on('join_tareas', (data) => {
    console.log(`Cliente quiere unirse a la sala: ${data.alumnoId}`);
    // Responde al cliente que se unió exitosamente
    socket.emit('joined_OK_tareas'); 
    console.log("Enviado evento 'joined_OK_tareas'");
  });

  // --- Oyente para 'crear_tarea' ---
  // Escucha cuando un cliente envía una nueva tarea
  socket.on('crear_tarea', (data) => {
    console.log('Nueva tarea recibida:', data);

    // 1. Aumentamos el contador
    cantidadTareasTotal++;

    // 2. Preparamos el objeto de respuesta
    //    (Simulamos la estructura que el examen espera)
    const dataActualizado = {
      id: Math.floor(Math.random() * 1000), // Un ID aleatorio
      texto: data.texto,
      prioridad: data.prioridad,
      creador: data.creador,
      cantidadTareas: cantidadTareasTotal,
      timestamp: new Date().toISOString()
    };

    // 3. Enviamos la 'nueva_tarea' a TODOS los clientes conectados
    io.emit('nueva_tarea', dataActualizado);
    console.log("Enviado evento 'nueva_tarea' a todos");

    // 4. Simulación de "tareas completas" (después de 5)
    if (cantidadTareasTotal >= 5) {
       console.log("Simulando tareas completas...");
       io.emit('tareas_completas');
       cantidadTareasTotal = 0; // Reiniciamos el contador
    }
  });

  // --- Oyente para desconexión ---
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado:', socket.id);
  });
});

// El servidor escucha en el puerto 4000
httpServer.listen(4000, () => console.log('Servidor SIMULADO escuchando en puerto 4000'));