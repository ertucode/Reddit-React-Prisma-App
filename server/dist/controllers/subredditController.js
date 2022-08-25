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
exports.leaveSubreddit = exports.joinSubreddit = exports.updateSubreddit = exports.deleteSubreddit = exports.createSubreddit = exports.getSubredditDescriptionAndSubbed = exports.getSubredditByName = exports.getSubredditById = exports.POST_FIELDS = exports.getAllSubreddits = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
const formatPosts_1 = require("./utils/formatPosts");
const checkEarlyReturn_1 = require("./utils/checkEarlyReturn");
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
const getSubredditDescriptionAndSubbed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const subreddit = yield (0, commitToDb_1.commitToDb)(app_1.prisma.subreddit.findUnique({
        where: { name: req.params.name },
        select: {
            id: true,
            description: true,
        },
    }));
    const userId = req.cookies.userId;
    if (!(0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        const user = yield app_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                subbedTo: {
                    select: { id: true },
                },
            },
        });
        const ids = (_a = user === null || user === void 0 ? void 0 : user.subbedTo) === null || _a === void 0 ? void 0 : _a.map((sub) => sub.id);
        subreddit.subscribedByMe = ids && ids.includes(subreddit.id);
    }
    else {
        subreddit.subscribedByMe = false;
    }
    return subreddit;
});
exports.getSubredditDescriptionAndSubbed = getSubredditDescriptionAndSubbed;
// PUT - /subreddit
const createSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.createSubreddit = createSubreddit;
// DELETE - /user/{id}
const deleteSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.deleteSubreddit = deleteSubreddit;
// POST - /user/{id}
const updateSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateSubreddit = updateSubreddit;
const joinSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if ((0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        return res.send(app_1.app.httpErrors.unauthorized("You can not join a subreddit since you are not logged in"));
    }
    const user = yield app_1.prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            id: true,
        },
    });
    if (user == null) {
        return res.send(app_1.app.httpErrors.internalServerError("I can't write code, you don't exist"));
    }
    const subO = yield app_1.prisma.subreddit.findFirst({
        where: {
            name: req.params.name,
        },
        select: {
            subscribedUsers: {
                select: {
                    id: true,
                },
            },
        },
    });
    const toSet = subO ? [...subO.subscribedUsers, user] : [user];
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.subreddit.update({
        where: {
            name: req.params.name,
        },
        data: {
            subscribedUsers: {
                set: toSet,
            },
        },
        select: {
            name: true,
        },
    }));
});
exports.joinSubreddit = joinSubreddit;
const leaveSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if ((0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        return res.send(app_1.app.httpErrors.unauthorized("You can not leave a subreddit since you are not logged in"));
    }
    const user = yield app_1.prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            id: true,
        },
    });
    if (user == null) {
        return res.send(app_1.app.httpErrors.internalServerError("I can't write code, you don't exist"));
    }
    const subO = yield app_1.prisma.subreddit.findFirst({
        where: {
            name: req.params.name,
        },
        select: {
            subscribedUsers: {
                select: {
                    id: true,
                },
            },
        },
    });
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.subreddit.update({
        where: {
            name: req.params.name,
        },
        data: {
            subscribedUsers: {
                set: (subO === null || subO === void 0 ? void 0 : subO.subscribedUsers.filter((subscribedUser) => subscribedUser.id !== user.id)) || [],
            },
        },
        select: {
            name: true,
        },
    }));
});
exports.leaveSubreddit = leaveSubreddit;
