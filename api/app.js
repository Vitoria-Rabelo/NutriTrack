const express = require("express");
const cors = require("cors");
const routerPaciente = require("./routers/PacienteRouter");
const routerReceita = require("./routers/ReceitaRouter");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json")

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/pacientes", routerPaciente);
app.use("/api/receitas", routerReceita);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((request, response) => {
    response.status(404).json({ erro: "Rota inválida." });
});

app.listen(port, () => {
    console.log(`API executando na porta ${port}`);
    console.log(`Documentação disponível em: http://localhost:${port}/api-docs`)
});