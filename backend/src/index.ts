import { Hono } from 'hono'
import { usersRouter } from './routes/users'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'
const app = new Hono()

app.use('/*', cors())
app.route('/api/v1/user', usersRouter)
app.route('/api/v1/blog', blogRouter)

export default app
