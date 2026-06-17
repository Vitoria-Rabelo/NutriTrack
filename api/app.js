const express = require("express");
const routerPaciente = require("./routers/PacienteRouter");
const routerReceita = require("./routers/ReceitaRouter");

const app = express();
const port = 3000;

app.use("/api/pacientes", routerPaciente);
app.use("/api/receitas", routerReceita);

app.use((request, response) => {
    response.status(404).json({ erro: "Rota inválida." });
});

app.listen(port, () => {
    console.log(`API executando na porta ${port}`);
    console.log(`Rotas disponíveis:`);
    console.log(`- GET  http://localhost:${port}/api/pacientes`);
    console.log(`- POST http://localhost:${port}/api/pacientes`);
    console.log(`- GET  http://localhost:${port}/api/receitas`);
    console.log(`- GET  http://localhost:${port}/api/receitas?categoria=NomeDaCategoria`);
});