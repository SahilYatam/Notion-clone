import dotenv from "dotenv"
dotenv.config();

import {app} from "./app.js"
import connectDatabase, { disconnectDatabase } from "./infrastructure/db/db.js"
import {createServer} from "../../../shared/Infrastrcuter/server/createServer.js"


const serviceName = "User-Service";

const DB_URI = process.env.DATABASE_URI
const port = process.env.PORT || 8000;

await createServer(app, port, serviceName, DB_URI, connectDatabase, disconnectDatabase)