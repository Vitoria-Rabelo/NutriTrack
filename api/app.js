const express = require("express");
const routerPaciente = require("./routers/PacienteRouter");

const app = express();
const port = 3000;

app.use("/api/pacientes", routerPaciente);

app.use((request, response) => {
    response.status(404).json({ erro: "Rota inválida." });
});

app.listen(port, () => {
    console.log(`API executando na porta ${port}`);
    console.log(`Rotas disponíveis:`);
    console.log(`- GET  http://localhost:${port}/api/pacientes`);
    console.log(`- POST http://localhost:${port}/api/pacientes`);
});