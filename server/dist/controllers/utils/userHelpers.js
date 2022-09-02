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
exports.MAIN_USER_SELECT = exports.sendUsersWithFollowInfo = exports.getUsersFromQuery = exports.sendUserCommentsFromName = exports.sendUserCommentsFromId = exports.getUserCommentsFromName = exports.getUserCommentsFromId = exports.getUserPostsFromName = exports.USER_COMMENTS_SELECT = exports.USER_POSTS_SELECT = exports.USER_FOLLOW_WHERE_FIELDS = exports.getFollowsOfUser = void 0;
const subredditController_1 = require("../subredditController");
const app_1 = require("../../app");
const commitToDb_1 = require("../commitToDb");
const formatPosts_1 = require("./formatPosts");
const client_1 = require("@prisma/client");
const checkEarlyReturn_1 = require("./checkEarlyReturn");
const getFollowsOfUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield app_1.prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            followedUsers: {
                select: {
                    id: true,
                },
            },
            subbedTo: {
                select: {
                    id: true,
                },
            },
        },
    });
    const subIds = user === null || user === void 0 ? void 0 : user.subbedTo.map((sub) => sub.id);
    const userIds = user === null || user === void 0 ? void 0 : user.followedUsers.map((u) => u.id);
    return { subIds, userIds };
});
exports.getFollowsOfUser = getFollowsOfUser;
const USER_FOLLOW_WHERE_FIELDS = (subIds, userIds) => {
    return {
        where: {
            OR: [
                {
                    subredditId: {
                        in: subIds,
                    },
                },
                {
                    userId: {
                        in: userIds,
                    },
                },
            ],
        },
    };
};
exports.USER_FOLLOW_WHERE_FIELDS = USER_FOLLOW_WHERE_FIELDS;
const USER_POSTS_SELECT = (extraPostOptions) => {
    return {
        select: {
            id: true,
            name: true,
            posts: Object.assign({ orderBy: {
                    createdAt: "desc",
                }, select: subredditController_1.POST_FIELDS }, extraPostOptions),
        },
    };
};
exports.USER_POSTS_SELECT = USER_POSTS_SELECT;
const USER_COMMENTS_SELECT = (extraCommentOptions = {}) => {
    return {
        select: {
            id: true,
            name: true,
            comments: Object.assign({ orderBy: {
                    createdAt: "desc",
                }, select: {
                    id: true,
                    body: true,
                    post: {
                        select: {
                            id: true,
                            title: true,
                            subreddit: { select: { name: true } },
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    _count: { select: { likes: true, dislikes: true } },
                    createdAt: true,
                    parentId: true,
                    scrollIndex: true,
                } }, extraCommentOptions),
        },
    };
};
exports.USER_COMMENTS_SELECT = USER_COMMENTS_SELECT;
const getUserPostsFromName = (name, extraOptions, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique(Object.assign({ where: { name } }, (0, exports.USER_POSTS_SELECT)(extraOptions)))).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, formatPosts_1.formatPostContainer)(user, req, res);
    }));
});
exports.getUserPostsFromName = getUserPostsFromName;
const getUserCommentsFromId = (id, extraOptions) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique(Object.assign({ where: { id } }, (0, exports.USER_COMMENTS_SELECT)(extraOptions))));
});
exports.getUserCommentsFromId = getUserCommentsFromId;
const getUserCommentsFromName = (name, extraOptions) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique(Object.assign({ where: { name } }, (0, exports.USER_COMMENTS_SELECT)(extraOptions))));
});
exports.getUserCommentsFromName = getUserCommentsFromName;
const sendUserCommentsFromId = (id, extraOptions, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserCommentsFromId)(id, extraOptions);
    if (user == null) {
        return res.send(app_1.app.httpErrors.badRequest("User id does not exist"));
    }
    return user;
});
exports.sendUserCommentsFromId = sendUserCommentsFromId;
const sendUserCommentsFromName = (name, extraOptions, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserCommentsFromName)(name, extraOptions);
    if (user == null) {
        return res.send(app_1.app.httpErrors.badRequest("Username does not exist"));
    }
    return user;
});
exports.sendUserCommentsFromName = sendUserCommentsFromName;
const USER_SELECT = {
    id: true,
    name: true,
    createdAt: true,
    _count: {
        select: {
            likedPosts: true,
            likedComments: true,
            dislikedPosts: true,
            dislikedComments: true,
        },
    },
};
const getUsersFromQuery = (query, additionalFindManyArgs = {}, additionalWhereArgs = {}) => __awaiter(void 0, void 0, void 0, function* () {
    return yield app_1.prisma.user.findMany(Object.assign({ where: Object.assign({ name: { contains: query, mode: "insensitive" } }, additionalWhereArgs), select: Object.assign({}, USER_SELECT) }, additionalFindManyArgs));
});
exports.getUsersFromQuery = getUsersFromQuery;
const sendUsersWithFollowInfo = (userId, users) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        const user = yield app_1.prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                followedUsers: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const followedUserIds = (_a = user === null || user === void 0 ? void 0 : user.followedUsers) === null || _a === void 0 ? void 0 : _a.map((_user) => _user.id);
        users.map((_user) => {
            _user.followedByMe = followedUserIds === null || followedUserIds === void 0 ? void 0 : followedUserIds.includes(_user.id);
            return _user;
        });
    }
    else {
        users.map((_user) => {
            _user.followedByMe = false;
            return _user;
        });
    }
    return users;
});
exports.sendUsersWithFollowInfo = sendUsersWithFollowInfo;
exports.MAIN_USER_SELECT = client_1.Prisma.validator()({
    id: true,
    name: true,
    posts: {
        select: {
            _count: {
                select: { likes: true, dislikes: true },
            },
        },
    },
    comments: {
        select: {
            _count: {
                select: { likes: true, dislikes: true },
            },
        },
    },
});
