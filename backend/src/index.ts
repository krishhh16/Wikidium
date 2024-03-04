import { Hono } from 'hono'
import { usersRouter } from './routes/users'
import { blogRouter } from './routes/blog'
const app = new Hono()

app.route('/api/v1/user', usersRouter)
app.route('/api/v1/blog', blogRouter)

export default app
