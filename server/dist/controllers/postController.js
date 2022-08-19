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
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.post.findMany({
        select: {
            id: true,
            title: true,
        },
    }));
});
exports.getAllPosts = getAllPosts;
const POST_COMMENT_FIELDS = {
    id: true,
    body: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            name: true,
        },
    },
    _count: { select: { likes: true, dislikes: true } },
};
// GET - /posts/{id}
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.post.findUnique({
        where: { id: req.params.id },
        select: Object.assign(Object.assign({ title: true }, POST_COMMENT_FIELDS), { comments: {
                orderBy: {
                    createdAt: "desc",
                },
                select: Object.assign({ parentId: true }, POST_COMMENT_FIELDS),
            }, subreddit: {
                select: {
                    id: true,
                    name: true,
                },
            } }),
    })).then((post) => __awaiter(void 0, void 0, void 0, function* () {
        if (post == null) {
            return res.send(app_1.app.httpErrors.badRequest("Post does not exist"));
        }
        const userId = req.cookies.userId;
        if (userId == null || userId === "") {
            const comments = post.comments.map((comment) => {
                return Object.assign(Object.assign({}, comment), { likedByMe: 0 });
            });
            return Object.assign(Object.assign({}, post), { comments, likedByMe: 0 });
        }
        const likes = yield app_1.prisma.user.findFirst({
            where: {
                id: req.cookies.userId,
            },
            select: {
                likedPosts: {
                    where: {
                        postId: post.id,
                    },
                    select: {
                        postId: true,
                    },
                },
                dislikedPosts: {
                    where: {
                        postId: post.id,
                    },
                    select: {
                        postId: true,
                    },
                },
                likedComments: {
                    where: {
                        commentId: {
                            in: post.comments.map((comment) => comment.id),
                        },
                    },
                    select: {
                        commentId: true,
                    },
                },
                dislikedComments: {
                    where: {
                        commentId: {
                            in: post.comments.map((comment) => comment.id),
                        },
                    },
                    select: {
                        commentId: true,
                    },
                },
            },
        });
        const likedComments = likes != null
            ? likes.likedComments.map((comment) => comment.commentId)
            : [];
        const dislikedComments = likes != null
            ? likes.dislikedComments.map((comment) => comment.commentId)
            : [];
        const comments = post.comments.map((comment) => {
            if (likedComments.includes(comment.id)) {
                return Object.assign(Object.assign({}, comment), { likedByMe: 1 });
            }
            else if (dislikedComments.includes(comment.id)) {
                return Object.assign(Object.assign({}, comment), { likedByMe: -1 });
            }
            return Object.assign(Object.assign({}, comment), { likedByMe: 0 });
        });
        const likedByMe = (likes === null || likes === void 0 ? void 0 : likes.likedPosts.length)
            ? 1
            : (likes === null || likes === void 0 ? void 0 : likes.dislikedPosts.length)
                ? -1
                : 0;
        return Object.assign(Object.assign({}, post), { comments,
            likedByMe });
    }));
});
exports.getPost = getPost;
// PUT - /post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            userId: req.cookies.userId,
            subredditId: req.body.subredditId,
        },
    }));
});
exports.createPost = createPost;
// DELETE - /user/{id}
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.deletePost = deletePost;
// POST - /user/{id}
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updatePost = updatePost;
