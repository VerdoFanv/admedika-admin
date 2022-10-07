import 'dotenv/config'
import { createServer } from "http"
import { parse } from "url"
import next from "next"

const hostname = process.env.NEXT_PUBLIC_HOST
const port = parseInt(process.env.NEXT_PUBLIC_PORT, 10)
const dev = process.env.NODE_ENV !== `production`

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const init = async () => {
	await app.prepare()
	createServer((req, res) => {
		const parsedUrl = parse(req.url!, true)
		handle(req, res, parsedUrl)
	}).listen(port)

	// tslint:disable-next-line:no-console
	console.log(
		`Server running on http://localhost:${port} as ${
			dev ? `development` : process.env.NODE_ENV
		}`
	)
}

init()