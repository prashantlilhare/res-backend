"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pino_http_1 = __importDefault(require("pino-http"));
const index_1 = __importDefault(require("./src/routes/index"));
const logger_1 = require("./src/lib/logger");
const error_middleware_1 = require("./src/middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, pino_http_1.default)({
    logger: logger_1.logger,
    serializers: {
        req(req) {
            return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
        },
        res(res) {
            return { statusCode: res.statusCode };
        },
    },
}));
app.use((0, cors_1.default)({ origin: ["http://localhost:5175"], credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", index_1.default);
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map