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
exports.unfollowUser = exports.followUser = exports.getUserPosts = exports.getUserById = exports.getUserFromCookie = exports.deleteUser = exports.updateUser = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
const bcrypt_1 = __importDefault(require("bcrypt"));
const subredditController_1 = require("./subredditController");
const formatPosts_1 = require("./utils/formatPosts");
const checkEarlyReturn_1 = require("./utils/checkEarlyReturn");
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
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
        },
    }));
});
exports.getUserFromCookie = getUserFromCookie;
const USER_SELECT = {
    select: {
        id: true,
        name: true,
        posts: {
            orderBy: {
                createdAt: "desc",
            },
            select: Object.assign({}, subredditController_1.POST_FIELDS),
        },
    },
};
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    // Implement conditional returning of some properties
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique(Object.assign({ where: {
            id: req.params.id,
        } }, USER_SELECT)));
});
exports.getUserById = getUserById;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.cookies.userId;
    // Implement conditional returning of some properties
    const user = yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique({
        where: {
            name: req.params.name,
        },
        select: {
            id: true,
        },
    }));
    if (user == null) {
        res.send(app_1.app.httpErrors.badRequest("Username does not exist"));
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique(Object.assign({ where: {
            name: req.params.name,
        } }, USER_SELECT))).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, formatPosts_1.formatPostContainer)(user, req, res);
    }));
});
exports.getUserPosts = getUserPosts;
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
