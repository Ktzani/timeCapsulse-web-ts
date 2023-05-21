import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'
import { request } from "http";

export async function memoriesRoutes (app: FastifyInstance) {
    //Esse é um middleware que sera utilizado para acessar qualquer rota de memorias, onde é necessario primeiro ter o token JWT para acessa-las
    //Ou seja, antes de executar o handler em cada uma dessas rotas, preciso verificar se o usuario está autenticado
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.get('/memories', async (request) => {
        const memories = await prisma.memory.findMany({
            where: {
                userId: request.user.sub
            },
            orderBy: {
                created_at: "asc"
            }
        })

        return memories.map(memory => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat("...")

            }
        })
    })

    app.get('/memories/:id', async (request, response) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id: id
            }
        })

        if(!memory.isPublic && memory.userId !== request.user.sub){
            return response.status(401).send()
        }

        return memory
    })

    app.post('/memories', async (request) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false) //coerce converte o valor que chegar para boolean
        })
        

        const { content, coverUrl, isPublic} = bodySchema.parse(request.body)

        const memory = await prisma.memory.create({
            data: {
                content, 
                coverUrl,
                isPublic,
                userId: request.user.sub
            }
        })

        return memory
    })

    app.put('/memories/:id', async (request, response) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false) //coerce converte o valor que chegar para boolean
        })

        const { content, coverUrl, isPublic} = bodySchema.parse(request.body)

        let memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            },
        })

        if(!memory.isPublic && memory.userId !== request.user.sub){
            return response.status(401).send()
        }

        memory = await prisma.memory.update({
            where: {
                id: id
            },
            data: {
                content, 
                coverUrl,
                isPublic,
            }
        })

        return memory
    })

    app.delete('/memories/:id', async (request, response) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            },
        })

        if(!memory.isPublic && memory.userId !== request.user.sub){
            return response.status(401).send()
        }

        await prisma.memory.delete({
            where: {
                id: id
            }
        })
    })
}