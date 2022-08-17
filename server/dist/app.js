"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const sensible_1 = __importDefault(require("@fastify/sensible"));
const dotenv_1 = __importDefault(require("dotenv"));
const post_1 = require("./routes/post");
const subreddit_1 = require("./routes/subreddit");
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, fastify_1.default)();
exports.app = app;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
app.register(sensible_1.default);
app.register(cors_1.default, {
    origin: process.env.CLIENT_URL,
    credentials: true
});
app.register(post_1.postRoutes);
app.register(subreddit_1.subredditRoutes);
app.listen({ port: process.env.PORT });
