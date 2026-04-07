import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./src/routes/index";
import { logger } from "./src/lib/logger";
import { errorHandler, notFoundHandler } from "./src/middlewares/error.middleware";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
