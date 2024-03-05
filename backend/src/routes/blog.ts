import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { CreateBlogInput, UpdateBlogInput, createBlogInput, updateBlogInput } from "@krishhh/medium-common";

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
    try {
    const token = c.req.header('authorization') || "";
    const user = await verify(token, c.env.JWT_SECRET)
    if (user) {
        c.set('userId', user.id)
    }
    await next();}
    catch(e) {
        c.status(403);
        return c.json({
            msg: "You are not logged in, aka you are an asshole"
        })
    }
})

blogRouter.post('/', async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    let body = await c.req.json();
    body = {
        ...body,
        id: c.get('userId')
    }
    const something = createBlogInput.safeParse(body);

    if(!something.success){
        c.status(403);
        return c.json({
            error: something
        })
    }

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
    const {success} = updateBlogInput.safeParse(body);

    if(!success){
        c.status(403);
        return c.json({
            error: 'Invalid payload'
        })
    }
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

    const blogs = await prisma.blog.findMany({
        select: {
            title: true,
            content: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

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
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
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