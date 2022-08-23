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
exports.updateSubreddit = exports.deleteSubreddit = exports.createSubreddit = exports.getSubredditByName = exports.getSubredditById = exports.POST_FIELDS = exports.getAllSubreddits = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
const formatPosts_1 = require("./utils/formatPosts");
// GET - /subreddits
const getAllSubreddits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.subreddit.findMany({
        select: {
            id: true,
            name: true,
        },
    }));
});
exports.getAllSubreddits = getAllSubreddits;
exports.POST_FIELDS = {
    id: true,
    title: true,
    body: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            name: true,
        },
    },
    _count: { select: { likes: true, dislikes: true, comments: true } },
    subreddit: {
        select: {
            name: true,
            id: true,
        },
    },
};
const SUBREDDIT_SELECT = {
    select: {
        id: true,
        name: true,
        posts: {
            orderBy: {
                createdAt: "desc",
            },
            select: Object.assign({}, exports.POST_FIELDS),
        },
    },
};
// GET - /subreddit/{id}
const getSubredditById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.subreddit.findUnique(Object.assign({ where: { id: req.params.id } }, SUBREDDIT_SELECT))).then((subreddit) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, formatPosts_1.formatPostContainer)(subreddit, req, res);
    }));
});
exports.getSubredditById = getSubredditById;
// GET - /subreddit/name/:name
const getSubredditByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.subreddit.findUnique(Object.assign({ where: { name: req.params.name } }, SUBREDDIT_SELECT))).then((subreddit) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, formatPosts_1.formatPostContainer)(subreddit, req, res);
    }));
});
exports.getSubredditByName = getSubredditByName;
// PUT - /subreddit
const createSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.createSubreddit = createSubreddit;
// DELETE - /user/{id}
const deleteSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.deleteSubreddit = deleteSubreddit;
// POST - /user/{id}
const updateSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateSubreddit = updateSubreddit;
