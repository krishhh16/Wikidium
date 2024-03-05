import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput, signinInput } from "@krishhh/medium-common"

export const usersRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

usersRouter.post('/signup', async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const {success } = signupInput.safeParse(body);
    if(!success) {
        c.status(411)
        return c.json({
            msg: "Inputs not correct"
        })
    }
    try{
    const user = await prisma.user.create({
        data: {
            username: body.username,
            password: body.password,
            name: body.name,
            email: body.email
        }
    })

    const token = await sign(user.id, c.env.JWT_SECRET)
    return c.json({token})

}
    catch (err){
        c.status(403)
        return c.text('UAE ' + err)
    }
})

usersRouter.post('/signin', async c => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);

    if(!success) {
        c.status(403)
        return c.json({
            msg: 'INputs not correct'
        })
    }
    try{
    const user = await prisma.user.findFirst({
        where: {
            password: body.password,
            email: body.email
        }
    })
    if(!user) {
        c.status(403)
        return c.json({
            message: "incorrect creds"
        })
    }
    const  token = await sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({
        token,})
    

}
    catch (err){
        c.status(403)
        return c.text('UAE')
    }
})