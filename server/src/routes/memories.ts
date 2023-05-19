import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'
import { request } from "http";

export async function memoriesRoutes (app: FastifyInstance) {
    app.get('/memories', async () => {
        const memories = await prisma.memory.findMany({
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

    app.get('/memories/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id: id
            }
        })

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
                userId: '73df5e03-2fa3-40cf-b069-9b867f06732c'
            }
        })

        return memory
    })

    app.put('/memories/:id', async (request) => {
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

        const memory = await prisma.memory.update({
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

    app.delete('/memories/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const memory = await prisma.memory.delete({
            where: {
                id: id
            }
        })
    })
}