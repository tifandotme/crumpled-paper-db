import jsonServer from "json-server"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import process from "node:process"

import { __dirname, dbPath } from "./utils.js"

const DELAY = 500 // ms

if (!fs.existsSync(dbPath)) {
  const { status } = spawnSync("node", [`${__dirname}/generate.js`], {
    stdio: "inherit",
  })

  if (status !== 0) {
    console.error("Failed to generate data")
    process.exit(1)
  }
}

const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"))

const server = jsonServer.create()
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
)
server.use((_, res, next) => {
  res.header("Access-Control-Allow-Headers", "*")

  setTimeout(next, DELAY)
})
server.use(router)

server.listen(process.env.PORT, () => {
  console.log("JSON Server is running")
})
