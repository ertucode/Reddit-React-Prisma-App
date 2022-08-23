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
exports.formatPostContainer = void 0;
const app_1 = require("../../app");
const checkEarlyReturn_1 = require("./checkEarlyReturn");
function formatPosts(posts, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const likes = yield app_1.prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                likedPosts: {
                    where: {
                        postId: {
                            in: posts.map((post) => post.id),
                        },
                    },
                    select: {
                        postId: true,
                    },
                },
                dislikedPosts: {
                    where: {
                        postId: {
                            in: posts.map((post) => post.id),
                        },
                    },
                    select: {
                        postId: true,
                    },
                },
            },
        });
        const formattedPosts = posts.map((post) => {
            var _a, _b;
            if ((_a = likes === null || likes === void 0 ? void 0 : likes.likedPosts) === null || _a === void 0 ? void 0 : _a.find((likedPost) => likedPost.postId === post.id)) {
                return Object.assign(Object.assign({}, post), { likedByMe: 1 });
            }
            else if ((_b = likes === null || likes === void 0 ? void 0 : likes.dislikedPosts) === null || _b === void 0 ? void 0 : _b.find((dislikedPost) => dislikedPost.postId === post.id)) {
                return Object.assign(Object.assign({}, post), { likedByMe: -1 });
            }
            return Object.assign(Object.assign({}, post), { likedByMe: 0 });
        });
        return formattedPosts;
    });
}
const formatPostContainer = (container, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (container == null) {
        return res.send(app_1.app.httpErrors.badRequest("Post does not exist"));
    }
    // If no cookie early return
    const userId = req.cookies.userId;
    const shouldReturn = (0, checkEarlyReturn_1.checkEarlyReturn)(userId);
    if (shouldReturn) {
        return (0, checkEarlyReturn_1.earlyReturn)(container);
    }
    const posts = yield formatPosts(container.posts, userId);
    return Object.assign(Object.assign({}, container), { posts });
});
exports.formatPostContainer = formatPostContainer;
