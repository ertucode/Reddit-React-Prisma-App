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
exports.getInfiniteUserSearchResult = exports.getInfiniteSubredditSearchResult = exports.getInfiniteCommentSearchResult = exports.getInfiniteUserPageComments = exports.getInfinitePostSearchResult = exports.getInfiniteUserPagePosts = exports.getInfiniteHomePagePosts = exports.getInfiniteAllPosts = void 0;
const app_1 = require("../app");
const checkEarlyReturn_1 = require("./utils/checkEarlyReturn");
const postController_1 = require("./postController");
const userHelpers_1 = require("./utils/userHelpers");
const commentHelpers_1 = require("./utils/commentHelpers");
const subredditHelper_1 = require("./utils/subredditHelper");
// ALWAYS RETURN CREATED AT
const take = 20;
const orderBy = { createdAt: "desc" };
const getWhereForCreatedAt = (createdAt) => {
    return { createdAt: { lt: createdAt } };
};
const getInfiniteAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdAt = parseCreatedAt(req);
    if (createdAt) {
        return yield (0, postController_1.getPosts)({
            where: getWhereForCreatedAt(createdAt),
            take,
            orderBy,
        }, req, res);
    }
    else {
        return yield (0, postController_1.getPosts)({ take, orderBy }, req, res);
    }
});
exports.getInfiniteAllPosts = getInfiniteAllPosts;
const getInfiniteHomePagePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if ((0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        return res.send(null);
    }
    const { subIds, userIds } = yield (0, userHelpers_1.getFollowsOfUser)(userId);
    const createdAt = parseCreatedAt(req);
    if (createdAt) {
        return yield (0, postController_1.getPosts)({
            where: Object.assign(Object.assign({}, (0, userHelpers_1.USER_FOLLOW_WHERE_FIELDS)(subIds, userIds).where), getWhereForCreatedAt(createdAt)),
            take,
            orderBy,
        }, req, res);
    }
    else {
        return yield (0, postController_1.getPosts)(Object.assign(Object.assign({}, (0, userHelpers_1.USER_FOLLOW_WHERE_FIELDS)(subIds, userIds)), { take,
            orderBy }), req, res);
    }
});
exports.getInfiniteHomePagePosts = getInfiniteHomePagePosts;
const getInfiniteUserPagePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.userName;
    if (name == null) {
        return res.send(app_1.app.httpErrors.badRequest("Provide a username"));
    }
    const createdAt = parseCreatedAt(req);
    if (createdAt) {
        return yield (0, userHelpers_1.getUserPostsFromName)(name, {
            where: getWhereForCreatedAt(createdAt),
            take,
            orderBy,
        }, req, res);
    }
    else {
        return yield (0, userHelpers_1.getUserPostsFromName)(name, { take, orderBy }, req, res);
    }
});
exports.getInfiniteUserPagePosts = getInfiniteUserPagePosts;
const getInfinitePostSearchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    const createdAt = parseCreatedAt(req);
    if (createdAt) {
        return yield (0, postController_1.getPosts)({
            where: Object.assign({ title: { contains: query, mode: "insensitive" } }, getWhereForCreatedAt(createdAt)),
            take,
            orderBy,
        }, req, res);
    }
    else {
        return yield (0, postController_1.getPosts)({
            where: { title: { contains: query, mode: "insensitive" } },
            take,
            orderBy,
        }, req, res);
    }
});
exports.getInfinitePostSearchResult = getInfinitePostSearchResult;
const getInfiniteUserPageComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.userName;
    if (name == null) {
        return res.send(app_1.app.httpErrors.badRequest("Provide a username"));
    }
    const createdAt = parseCreatedAt(req);
    if (createdAt) {
        return yield (0, userHelpers_1.sendUserCommentsFromName)(name, {
            where: getWhereForCreatedAt(createdAt),
            take,
            orderBy,
        }, req, res);
    }
    else {
        return yield (0, userHelpers_1.sendUserCommentsFromName)(name, { take, orderBy }, req, res);
    }
});
exports.getInfiniteUserPageComments = getInfiniteUserPageComments;
const getInfiniteCommentSearchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    const createdAt = parseCreatedAt(req);
    if (createdAt) {
        return yield (0, commentHelpers_1.getCommentsFromQuery)(query, getWhereForCreatedAt(createdAt), {
            take,
            orderBy,
        });
    }
    else {
        return yield (0, commentHelpers_1.getCommentsFromQuery)(query, {}, {
            take,
            orderBy,
        });
    }
});
exports.getInfiniteCommentSearchResult = getInfiniteCommentSearchResult;
const getInfiniteSubredditSearchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    const createdAt = parseCreatedAt(req);
    if (createdAt) {
        return yield (0, subredditHelper_1.sendSubredditSearchResult)(query, req, take, { orderBy }, getWhereForCreatedAt(createdAt));
    }
    else {
        return yield (0, subredditHelper_1.sendSubredditSearchResult)(query, req, take, {
            orderBy,
        });
    }
});
exports.getInfiniteSubredditSearchResult = getInfiniteSubredditSearchResult;
const getInfiniteUserSearchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    const createdAt = parseCreatedAt(req);
    let users;
    if (createdAt) {
        users = yield (0, userHelpers_1.getUsersFromQuery)(query, { take, orderBy }, getWhereForCreatedAt(createdAt));
    }
    else {
        users = yield (0, userHelpers_1.getUsersFromQuery)(query, {
            take,
            orderBy,
        });
    }
    const userId = req.cookies.userId;
    return yield (0, userHelpers_1.sendUsersWithFollowInfo)(userId, users);
});
exports.getInfiniteUserSearchResult = getInfiniteUserSearchResult;
const parseCreatedAt = (req) => {
    const createdAt = new Date(req.params.createdAt);
    if (isNaN(createdAt.getTime())) {
        return;
    }
    return createdAt;
};
