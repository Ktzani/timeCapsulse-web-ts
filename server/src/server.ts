import Fastify from "fastify";
import cors from "@fastify/cors"
import { memoriesRoutes } from "./routes/memories";

const app = Fastify()

app.register(cors, {
    origin: ["https://localhost:3000"]
}) // Aqui posso colocar quais endereços do front podem acessar o back

app.register(memoriesRoutes)

app.listen({
    port: 8080 
}).then(() => {
    console.log("Servidor rodando na porta 8080")
})