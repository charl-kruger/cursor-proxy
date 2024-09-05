import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { proxy } from './proxy';

type Bindings = {
	AI: Ai;
	OPENAI_API_KEY: string;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())
app.post('/*', proxy)

export default app
