"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
}
function notFoundHandler(req, res) {
    res.status(404).json({ error: "Not Found" });
}
//# sourceMappingURL=error.middleware.js.map