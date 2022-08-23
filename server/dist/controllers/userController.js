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
exports.getUserPosts = exports.getUserById = exports.getUserFromCookie = exports.deleteUser = exports.updateUser = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
const bcrypt_1 = __importDefault(require("bcrypt"));
const subredditController_1 = require("./subredditController");
const formatPosts_1 = __importDefault(require("./utils/formatPosts"));
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
        if (user == null) {
            return res.send(app_1.app.httpErrors.badRequest("Post does not exist"));
        }
        // If no cookie early return
        const userId = req.cookies.userId;
        if (userId == null || userId === "") {
            const posts = user.posts.map((post) => {
                return Object.assign(Object.assign({}, post), { likedByMe: 0 });
            });
            return Object.assign(Object.assign({}, user), { posts });
        }
        // const likes = await prisma.user.findFirst({
        // 	where: {
        // 		id: req.cookies.userId,
        // 	},
        // 	select: {
        // 		likedPosts: {
        // 			where: {
        // 				postId: {
        // 					in: user.posts.map((post: Post) => post.id),
        // 				},
        // 			},
        // 			select: {
        // 				postId: true,
        // 			},
        // 		},
        // 		dislikedPosts: {
        // 			where: {
        // 				postId: {
        // 					in: user.posts.map((post: Post) => post.id),
        // 				},
        // 			},
        // 			select: {
        // 				postId: true,
        // 			},
        // 		},
        // 	},
        // });
        // const posts = user.posts.map((post: Post) => {
        // 	if (
        // 		likes?.likedPosts?.find(
        // 			(likedPost) => likedPost.postId === post.id
        // 		)
        // 	) {
        // 		return { ...post, likedByMe: 1 };
        // 	} else if (
        // 		likes?.dislikedPosts?.find(
        // 			(dislikedPost) => dislikedPost.postId === post.id
        // 		)
        // 	) {
        // 		return { ...post, likedByMe: -1 };
        // 	}
        // 	return { ...post, likedByMe: 0 };
        // });
        const posts = yield (0, formatPosts_1.default)(user.posts, userId);
        return Object.assign(Object.assign({}, user), { posts });
    }));
});
exports.getUserPosts = getUserPosts;
