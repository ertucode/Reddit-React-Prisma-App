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
exports.togglePostDislike = exports.togglePostLike = exports.toggleCommentDislike = exports.toggleCommentLike = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
// POST - /posts/postId/comments/commentId/toggleLike
const toggleCommentLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        commentId: req.params.commentId,
        userId: req.cookies.userId || "",
    };
    if (data.commentId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You need to include a comment"));
    }
    if (data.userId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You can not update someone else's like"));
    }
    const like = yield app_1.prisma.commentLike.findUnique({
        where: { userId_commentId: data },
    });
    if (like == null) {
        const dislike = yield app_1.prisma.commentDislike.findUnique({
            where: { userId_commentId: data },
        });
        let info = {};
        if (dislike != null) {
            yield (0, commitToDb_1.commitToDb)(app_1.prisma.commentDislike.delete({
                where: {
                    userId_commentId: data,
                },
            }));
            info = { dislikeChange: -1 };
        }
        else {
            info = { dislikeChange: 0 };
        }
        return yield (0, commitToDb_1.commitToDb)(app_1.prisma.commentLike.create({ data }).then(() => {
            return Object.assign({ likeChange: 1 }, info);
        }));
    }
    else {
        return yield (0, commitToDb_1.commitToDb)(app_1.prisma.commentLike
            .delete({
            where: {
                userId_commentId: data,
            },
        })
            .then(() => {
            return { likeChange: -1, dislikeChange: 0 };
        }));
    }
});
exports.toggleCommentLike = toggleCommentLike;
// POST - /posts/postId/comments/commentId/toggleDislike
const toggleCommentDislike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        commentId: req.params.commentId,
        userId: req.cookies.userId || "",
    };
    if (data.commentId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You need to include a comment"));
    }
    if (data.userId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You can not update someone else's like"));
    }
    const dislike = yield app_1.prisma.commentDislike.findUnique({
        where: { userId_commentId: data },
    });
    if (dislike == null) {
        const like = yield app_1.prisma.commentLike.findUnique({
            where: { userId_commentId: data },
        });
        let info = {};
        if (like != null) {
            yield (0, commitToDb_1.commitToDb)(app_1.prisma.commentLike.delete({
                where: {
                    userId_commentId: data,
                },
            }));
            info = { likeChange: -1 };
        }
        else {
            info = { likeChange: 0 };
        }
        return yield (0, commitToDb_1.commitToDb)(app_1.prisma.commentDislike.create({ data }).then(() => {
            return Object.assign({ dislikeChange: 1 }, info);
        }));
    }
    else {
        return yield (0, commitToDb_1.commitToDb)(app_1.prisma.commentDislike
            .delete({
            where: {
                userId_commentId: data,
            },
        })
            .then(() => {
            return { dislikeChange: -1, likeChange: 0 };
        }));
    }
});
exports.toggleCommentDislike = toggleCommentDislike;
// POST - /posts/postId/toggleLike
const togglePostLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        postId: req.params.postId,
        userId: req.cookies.userId || "",
    };
    if (data.postId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You need to include a post"));
    }
    if (data.userId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You can not update someone else's like"));
    }
    const like = yield app_1.prisma.postLike.findUnique({
        where: { userId_postId: data },
    });
    if (like == null) {
        const dislike = yield app_1.prisma.postDislike.findUnique({
            where: { userId_postId: data },
        });
        let info = {};
        if (dislike != null) {
            yield (0, commitToDb_1.commitToDb)(app_1.prisma.postDislike.delete({
                where: {
                    userId_postId: data,
                },
            }));
            info = { dislikeChange: -1 };
        }
        else {
            info = { dislikeChange: 0 };
        }
        return yield (0, commitToDb_1.commitToDb)(app_1.prisma.postLike.create({ data }).then(() => {
            return Object.assign({ likeChange: 1 }, info);
        }));
    }
    else {
        return yield (0, commitToDb_1.commitToDb)(app_1.prisma.postLike
            .delete({
            where: {
                userId_postId: data,
            },
        })
            .then(() => {
            return { likeChange: -1, dislikeChange: 0 };
        }));
    }
});
exports.togglePostLike = togglePostLike;
// POST - /posts/postId/toggleDislike
const togglePostDislike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        postId: req.params.postId,
        userId: req.cookies.userId || "",
    };
    if (data.postId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You need to include a post"));
    }
    if (data.userId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You can not update someone else's like"));
    }
    const dislike = yield app_1.prisma.postDislike.findUnique({
        where: { userId_postId: data },
    });
    if (dislike == null) {
        const like = yield app_1.prisma.postLike.findUnique({
            where: { userId_postId: data },
        });
        let info = {};
        if (like != null) {
            yield (0, commitToDb_1.commitToDb)(app_1.prisma.postLike.delete({
                where: {
                    userId_postId: data,
                },
            }));
            info = { likeChange: -1 };
        }
        else {
            info = { likeChange: 0 };
        }
        return yield (0, commitToDb_1.commitToDb)(app_1.prisma.postDislike.create({ data }).then(() => {
            return Object.assign({ dislikeChange: 1 }, info);
        }));
    }
    else {
        return yield (0, commitToDb_1.commitToDb)(app_1.prisma.postDislike
            .delete({
            where: {
                userId_postId: data,
            },
        })
            .then(() => {
            return { dislikeChange: -1, likeChange: 0 };
        }));
    }
});
exports.togglePostDislike = togglePostDislike;
