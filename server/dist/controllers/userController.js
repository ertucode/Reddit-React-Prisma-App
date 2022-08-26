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
exports.getFollowsAndSubscribes = exports.getUserPageInfo = exports.unfollowUser = exports.followUser = exports.getUserComments = exports.getUserPosts = exports.getUserById = exports.getUserFromCookie = exports.deleteUser = exports.updateUser = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
const bcrypt_1 = __importDefault(require("bcrypt"));
const checkEarlyReturn_1 = require("./utils/checkEarlyReturn");
const userHelpers_1 = require("./utils/userHelpers");
// PUT -
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (userId !== req.cookies.userId) {
        return res.send(app_1.app.httpErrors.unauthorized("Token does not match"));
    }
    const user = yield app_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    const userWithSameName = req.body.name &&
        (yield app_1.prisma.user.findFirst({
            where: {
                name: req.body.name,
            },
        }));
    if (userWithSameName != null) {
        return res.send(app_1.app.httpErrors.badRequest("Username already exists"));
    }
    const userWithSameEmail = req.body.email &&
        (yield app_1.prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
            select: {
                name: true,
                email: true,
            },
        }));
    if (userWithSameEmail != null) {
        return res.send(app_1.app.httpErrors.badRequest("Email already exists"));
    }
    if (req.body.password) {
        const salt = bcrypt_1.default.genSaltSync(10);
        req.body.password = bcrypt_1.default.hashSync(req.body.password, salt);
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: Object.assign({}, req.body),
        select: {
            id: true,
            name: true,
            email: true,
        },
    }));
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (userId !== req.cookies.userId) {
        return res.send(app_1.app.httpErrors.unauthorized("Token does not match"));
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.delete({
        where: {
            id: userId,
        },
        select: {
            id: true,
        },
    }));
});
exports.deleteUser = deleteUser;
const getUserFromCookie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if (userId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You are not logged in"));
    }
    const user = yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
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
        },
    }));
    if (user == null)
        return user;
    return Object.assign(Object.assign({}, user), { karma: 2 * getLikeDiff(user.posts) + getLikeDiff(user.comments) });
});
exports.getUserFromCookie = getUserFromCookie;
function getLikeDiff(list) {
    return list.reduce((prev, curr) => prev + curr._count.likes - curr._count.dislikes, 0);
}
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    // Implement conditional returning of some properties
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique(Object.assign({ where: {
            id: req.params.id,
        } }, userHelpers_1.USER_POSTS_SELECT)));
});
exports.getUserById = getUserById;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.cookies.userId;
    // Implement conditional returning of some properties
    const name = req.params.name;
    const user = yield (0, userHelpers_1.getUserPostsFromName)(name, {}, req, res);
    if (user == null) {
        return res.send(app_1.app.httpErrors.badRequest("Username does not exist"));
    }
    return user;
});
exports.getUserPosts = getUserPosts;
const getUserComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.cookies.userId;
    // Implement conditional returning of some properties
    const name = req.params.name;
    if (name == null) {
        return res.send(app_1.app.httpErrors.badRequest("Provide user name"));
    }
    const user = yield (0, userHelpers_1.getUserCommentsFromId)(req.params.name, {});
    if (user == null) {
        return res.send(app_1.app.httpErrors.badRequest("Username does not exist"));
    }
    return user;
});
exports.getUserComments = getUserComments;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if ((0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        return res.send(app_1.app.httpErrors.unauthorized("You can not follow a user since you are not logged in"));
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
    const userO = yield app_1.prisma.user.findFirst({
        where: {
            name: req.params.name,
        },
        select: {
            followedBy: {
                select: {
                    id: true,
                },
            },
        },
    });
    const toSet = userO ? [...userO.followedBy, user] : [user];
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.update({
        where: {
            name: req.params.name,
        },
        data: {
            followedBy: {
                set: toSet,
            },
        },
        select: {
            name: true,
        },
    }));
});
exports.followUser = followUser;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if ((0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        return res.send(app_1.app.httpErrors.unauthorized("You can not unfollow a user since you are not logged in"));
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
    const userO = yield app_1.prisma.user.findFirst({
        where: {
            name: req.params.name,
        },
        select: {
            followedBy: {
                select: {
                    id: true,
                },
            },
        },
    });
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.update({
        where: {
            name: req.params.name,
        },
        data: {
            followedBy: {
                set: (userO === null || userO === void 0 ? void 0 : userO.followedBy.filter((follower) => follower.id !== user.id)) || [],
            },
        },
        select: {
            name: true,
        },
    }));
});
exports.unfollowUser = unfollowUser;
const getUserPageInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const desiredUser = yield app_1.prisma.user.findFirst({
        where: {
            name: req.params.name,
        },
        select: {
            id: true,
        },
    });
    if (desiredUser == null) {
        return res.send(app_1.app.httpErrors.internalServerError("User does not exist"));
    }
    const userId = req.cookies.userId;
    if (!(0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        const queryingUser = yield app_1.prisma.user.findFirst({
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
        const ids = (_a = queryingUser === null || queryingUser === void 0 ? void 0 : queryingUser.followedUsers) === null || _a === void 0 ? void 0 : _a.map((u) => u.id);
        desiredUser.followedByMe = ids && ids.includes(desiredUser.id);
    }
    else {
        desiredUser.followedByMe = false;
    }
    return desiredUser;
});
exports.getUserPageInfo = getUserPageInfo;
const getFollowsAndSubscribes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if ((0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        return res.send(null);
    }
    const user = yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            followedUsers: {
                select: {
                    name: true,
                },
            },
            subbedTo: {
                select: {
                    name: true,
                },
            },
        },
    }));
    if (user == null) {
        res.send(app_1.app.httpErrors.badRequest("I cant code"));
    }
    return user;
});
exports.getFollowsAndSubscribes = getFollowsAndSubscribes;
