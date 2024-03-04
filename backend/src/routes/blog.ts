import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();

blogRouter.use("/*", async (c, next) =>{ 
    const token = c.req.header('authorization') || "";
    const user = await verify(token, c.env.JWT_SECRET)
    if (user) {
        c.set('userId', user.id)
    }
    await next();
})

blogRouter.post('/', async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(c.get('userId'))
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put("/", async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();
    try {
    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(c.get('userId'))
        }
    })

    return c.json({
        blog
    })}
    catch(err){
        c.status(401);
        return c.json({
            msg: "error while updating the blog post"
        })
    }
})

blogRouter.get("/bulk", async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const blogs = await prisma.blog.findMany();

    return c.json({
        blogs
    })
})

blogRouter.get('/:id', async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const id = await c.req.param('id')

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id)
            }
        })

        return c.json({
            blog
        })
    }catch(e){
        c.status(411)
        return c.text('something went wrong')
    }

    
})