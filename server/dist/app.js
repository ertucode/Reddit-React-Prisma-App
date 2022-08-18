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
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, fastify_1.default)();
exports.app = app;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
let USER_ID = "";
function getUserId() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        USER_ID =
            ((_a = (yield prisma.user.findFirst({ where: { name: "Kyle" } }))) === null || _a === void 0 ? void 0 : _a.id) ||
                "no id";
    });
}
getUserId();
app.register(cookie_1.default, { secret: process.env.COOKIE_SECRET });
// DON'T PUT ASYNC
app.addHook("onRequest", (req, res, done) => {
    if (req.cookies.userId !== USER_ID) {
        req.cookies.userId = USER_ID;
        res.clearCookie("userId");
        res.setCookie("userId", USER_ID);
    }
    done();
});
app.register(sensible_1.default);
app.register(cors_1.default, {
    origin: process.env.CLIENT_URL,
    credentials: true,
});
app.register(post_1.postRoutes);
app.register(subreddit_1.subredditRoutes);
app.register(comment_1.commentRoutes);
app.register(like_1.likeRoutes);
app.listen({ port: process.env.PORT });
