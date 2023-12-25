import path from "node:path"
import url from "node:url"

export const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
export const dbPath = path.join(__dirname, "db.json")
