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
exports.searchSubreddits = exports.searchUsers = exports.searchComments = exports.searchPosts = exports.searchEverything = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
const formatPosts_1 = require("./utils/formatPosts");
const subredditController_1 = require("./subredditController");
const commentHelpers_1 = require("./utils/commentHelpers");
const subredditHelper_1 = require("./utils/subredditHelper");
const userHelpers_1 = require("./utils/userHelpers");
const searchEverything = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const query = req.params.query;
    let count = parseInt(req.params.count);
    if (isNaN(count)) {
        return res.send(app_1.app.httpErrors.badRequest("Invalid count"));
    }
    const models = [];
    models.push(...(((_a = (yield app_1.prisma.subreddit.findMany({
        where: {
            name: { contains: query, mode: "insensitive" },
        },
        select: {
            id: true,
            name: true,
        },
        take: count,
    }))) === null || _a === void 0 ? void 0 : _a.map((subreddit) => {
        return Object.assign(Object.assign({}, subreddit), { type: "Subreddit" });
    })) || []));
    if (count <= models.length)
        return models;
    models.push(...(((_b = (yield app_1.prisma.post.findMany({
        where: {
            title: { contains: query, mode: "insensitive" },
        },
        select: {
            id: true,
            title: true,
        },
        take: count - models.length,
    }))) === null || _b === void 0 ? void 0 : _b.map((post) => {
        return Object.assign(Object.assign({}, post), { name: post.title, type: "Post" });
    })) || []));
    if (count <= models.length)
        return models;
    models.push(...(((_c = (yield app_1.prisma.user.findMany({
        where: {
            name: { contains: query, mode: "insensitive" },
        },
        select: {
            id: true,
            name: true,
        },
        take: count - models.length,
    }))) === null || _c === void 0 ? void 0 : _c.map((subreddit) => {
        return Object.assign(Object.assign({}, subreddit), { type: "User" });
    })) || []));
    return models;
});
exports.searchEverything = searchEverything;
const POST_SELECTION = {
    orderBy: {
        createdAt: "desc",
    },
    select: Object.assign({}, subredditController_1.POST_FIELDS),
};
const searchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    let count = parseInt(req.params.count);
    if (isNaN(count)) {
        return res.send(app_1.app.httpErrors.badRequest("Invalid count"));
    }
    const posts = (yield (0, commitToDb_1.commitToDb)(app_1.prisma.post.findMany(Object.assign(Object.assign({ where: {
            title: { contains: query, mode: "insensitive" },
        } }, POST_SELECTION), { take: count })))) || [];
    if (count <= (posts === null || posts === void 0 ? void 0 : posts.length))
        return yield (0, formatPosts_1.formatPostContainer)({ posts }, req, res);
    const postIdArray = posts.map((post) => post.id);
    posts.push(...((yield app_1.prisma.post.findMany(Object.assign(Object.assign({ where: {
            body: { contains: query, mode: "insensitive" },
            NOT: {
                id: { in: postIdArray },
            },
        } }, POST_SELECTION), { take: count - posts.length }))) || []));
    return yield (0, formatPosts_1.formatPostContainer)({ posts }, req, res);
});
exports.searchPosts = searchPosts;
const searchComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    let count = parseInt(req.params.count);
    if (isNaN(count)) {
        return res.send(app_1.app.httpErrors.badRequest("Invalid count"));
    }
    return yield (0, commentHelpers_1.getCommentsFromQuery)(query, {}, { take: count });
});
exports.searchComments = searchComments;
const USER_SELECT = {
    id: true,
    name: true,
    _count: {
        select: {
            likedPosts: true,
            likedComments: true,
            dislikedPosts: true,
            dislikedComments: true,
        },
    },
};
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    let count = parseInt(req.params.count);
    if (isNaN(count)) {
        return res.send(app_1.app.httpErrors.badRequest("Invalid count"));
    }
    const users = yield (0, userHelpers_1.getUsersFromQuery)(query, { take: count });
    const userId = req.cookies.userId;
    return yield (0, userHelpers_1.sendUsersWithFollowInfo)(userId, users);
});
exports.searchUsers = searchUsers;
const searchSubreddits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    let count = parseInt(req.params.count);
    if (isNaN(count)) {
        return res.send(app_1.app.httpErrors.badRequest("Invalid count"));
    }
    return yield (0, subredditHelper_1.sendSubredditSearchResult)(query, req, count);
});
exports.searchSubreddits = searchSubreddits;
