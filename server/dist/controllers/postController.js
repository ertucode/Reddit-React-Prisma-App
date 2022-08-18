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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.deletePost = exports.createPost = exports.getPost = exports.getAllPosts = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
// GET - /posts
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.post.findMany({ select: {
            id: true,
            title: true
        } }));
});
exports.getAllPosts = getAllPosts;
// GET - /posts/{id}
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.post.findUnique({
        where: { id: req.params.id },
        select: {
            id: true,
            title: true,
            body: true,
            createdAt: true,
            likes: true,
            dislikes: true,
            user: {
                select: {
                    id: true,
                    name: true
                }
            },
            comments: {
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    body: true,
                    parentId: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            },
            subreddit: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    }));
});
exports.getPost = getPost;
// PUT - /post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.body.body === "" || req.body.body == null) {
        return res.send(app_1.app.httpErrors.badRequest("Post body is required"));
    }
    if (req.body.title === null || req.body.title == "") {
        return res.send(app_1.app.httpErrors.badRequest("Post title is required"));
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.post.create({
        data: {
            title: req.body.title,
            body: req.body.body,
            userId: ((_a = (yield app_1.prisma.user.findFirst({ where: { name: "Kyle" } }))) === null || _a === void 0 ? void 0 : _a.id) || "no id",
            subredditId: req.body.subredditId,
        }
    }));
});
exports.createPost = createPost;
// DELETE - /user/{id}
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.deletePost = deletePost;
// POST - /user/{id}
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.updatePost = updatePost;
