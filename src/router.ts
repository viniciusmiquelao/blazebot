import { Router } from "express"
import { ConfigsController } from "./useCases/configs/ConfigsController"
import { StopController } from "./useCases/stop/StopController"

const routes = Router()

const configController = new ConfigsController()
const stopController = new StopController()

routes.post("/colors", configController.handle)
routes.get("/stop", stopController.handle)

export { routes }