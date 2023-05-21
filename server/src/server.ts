import 'dotenv/config'

import Fastify from "fastify";
import cors from "@fastify/cors"
import jwt from '@fastify/jwt';
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from './routes/auth';

const app = Fastify()

app.register(cors, {
    origin: true
}) // Aqui posso colocar quais endereços do front podem acessar o back

app.register(jwt, {
    secret: 'spacetime'
})

app.register(memoriesRoutes)
app.register(authRoutes)

app.listen({
    port: 8080 
}).then(() => {
    console.log("Servidor rodando na porta 8080")
})