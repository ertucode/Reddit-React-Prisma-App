"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const sensible_1 = __importDefault(require("@fastify/sensible"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const dotenv_1 = __importDefault(require("dotenv"));
const post_1 = require("./routes/post");
const subreddit_1 = require("./routes/subreddit");
const comment_1 = require("./routes/comment");
const like_1 = require("./routes/like");
const auth_1 = require("./routes/auth");
const user_1 = require("./routes/user");
const search_1 = require("./routes/search");
const infinite_scroll_1 = require("./routes/infinite_scroll");
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
const verifyToken_1 = require("./verifyToken");
dotenv_1.default.config();
const app = (0, fastify_1.default)();
exports.app = app;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
app.register(cookie_1.default, { secret: process.env.COOKIE_SECRET });
app.addHook("onRequest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, verifyToken_1.getUserIdFromToken)(req);
    if (userId != null) {
        req.cookies.userId = userId;
    }
    else {
        res.setCookie("userToken", "");
    }
}));
app.register(sensible_1.default);
app.register(cors_1.default, {
    origin: process.env.CLIENT_URL,
    credentials: true,
});
app.register(auth_1.authRoutes);
app.register(user_1.userRoutes);
app.register(post_1.postRoutes);
app.register(subreddit_1.subredditRoutes);
app.register(comment_1.commentRoutes);
app.register(like_1.likeRoutes);
app.register(search_1.searchRoutes);
app.register(infinite_scroll_1.infiniteRoutes);
app.listen({ host: "0.0.0.0", port: process.env.PORT }, (err, address) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log("Server is running at -> ", address);
    }
});
