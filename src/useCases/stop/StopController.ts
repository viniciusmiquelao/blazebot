import { Request, Response } from "express"
import { MetricDouble } from "../../helpers/BotMetrics/MetricDouble"

class StopController {
    async handle(request: Request, response: Response) {
       const metric = new MetricDouble()
       metric.stopBot();
    }
}

export { StopController }