"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("./app");
const verifyToken = (req, res, next) => {
    const token = req.cookies.userToken;
    if (!token)
        return res.send(app_1.app.httpErrors.unauthorized("You are not authorized"));
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.send(app_1.app.httpErrors.unauthorized("Token is not valid"));
        req.params.tokenId = user && typeof user !== "string" && user.id;
    });
    next();
};
exports.verifyToken = verifyToken;
const getUserIdFromToken = (req) => {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.userToken;
    if (!token)
        return;
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return user && typeof user !== "string" && user.id;
    }
    catch (err) {
        console.log(err);
    }
};
exports.getUserIdFromToken = getUserIdFromToken;
