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
exports.deleteComment = exports.updateComment = exports.postComment = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
// POST - /posts/post{id}/comment
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.body === "" || req.body.body == null) {
        return res.send(app_1.app.httpErrors.badRequest("Message is required"));
    }
    const userId = req.cookies.userId;
    if (userId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You are not logged in"));
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.comment.create({
        data: {
            body: req.body.body,
            userId,
            parentId: req.body.parentId,
            postId: req.params.id,
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
                },
            },
        },
    })).then((comment) => {
        return Object.assign(Object.assign({}, comment), { likedByMe: false, _count: { likes: 0, dislikes: 0 } });
    });
});
exports.postComment = postComment;
// PUT  - /posts/postId/comments/commendId
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.body === "" || req.body.body == null) {
        return res.send(app_1.app.httpErrors.badRequest("Message is required"));
    }
    const user = yield app_1.prisma.comment.findUnique({
        where: {
            id: req.params.commentId,
        },
        select: {
            userId: true,
        },
    });
    if (user == null) {
        return res.send(app_1.app.httpErrors.badRequest("Comment does not exist"));
    }
    if (user.userId !== req.cookies.userId) {
        return res.send(app_1.app.httpErrors.unauthorized("You can not change someone else's comment"));
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.comment.update({
        where: {
            id: req.params.commentId,
        },
        data: {
            body: req.body.body,
        },
        select: {
            body: true,
        },
    }));
});
exports.updateComment = updateComment;
// DELETE  - /posts/postId/comments/commendId
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield app_1.prisma.comment.findUnique({
        where: {
            id: req.params.commentId,
        },
        select: {
            userId: true,
        },
    });
    if (user == null) {
        return res.send(app_1.app.httpErrors.badRequest("Comment does not exist"));
    }
    if (user.userId !== req.cookies.userId) {
        return res.send(app_1.app.httpErrors.unauthorized("You can not delete someone else's comment"));
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.comment.delete({
        where: {
            id: req.params.commentId,
        },
        select: {
            id: true,
        },
    }));
});
exports.deleteComment = deleteComment;
