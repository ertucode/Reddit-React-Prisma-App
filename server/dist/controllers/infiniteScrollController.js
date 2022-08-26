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
const TAKE_COUNT = 20;
const nextDataLogic = (scrollIndex) => {
    return {
        take: TAKE_COUNT,
        skip: 1,
        cursor: { scrollIndex },
    };
};
const getInfiniteAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scrollIndex = parseInt(req.params.scrollIndex);
    if (isNaN(scrollIndex)) {
        return yield (0, postController_1.getPosts)({ take: TAKE_COUNT }, req, res);
    }
    return yield (0, postController_1.getPosts)(nextDataLogic(scrollIndex), req, res);
});
exports.getInfiniteAllPosts = getInfiniteAllPosts;
const getInfiniteHomePagePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    const scrollIndex = parseInt(req.params.scrollIndex);
    if ((0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        return res.send(null);
    }
    const { subIds, userIds } = yield (0, userHelpers_1.getFollowsOfUser)(userId);
    if (isNaN(scrollIndex)) {
        return yield (0, postController_1.getPosts)(Object.assign(Object.assign({}, (0, userHelpers_1.USER_FOLLOW_WHERE_FIELDS)(subIds, userIds)), { take: TAKE_COUNT }), req, res);
    }
    return yield (0, postController_1.getPosts)(Object.assign(Object.assign({}, (0, userHelpers_1.USER_FOLLOW_WHERE_FIELDS)(subIds, userIds)), nextDataLogic(scrollIndex)), req, res);
});
exports.getInfiniteHomePagePosts = getInfiniteHomePagePosts;
const getInfiniteUserPagePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.name;
    const scrollIndex = parseInt(req.params.scrollIndex);
    if (req.params.name == null) {
        return res.send(app_1.app.httpErrors.badRequest("Provide a username"));
    }
    if (isNaN(scrollIndex)) {
        return yield (0, userHelpers_1.getUserPostsFromName)(name, { take: TAKE_COUNT }, req, res);
    }
    // Most likely wont work
    return yield (0, userHelpers_1.getUserPostsFromName)(name, nextDataLogic(scrollIndex), req, res);
});
exports.getInfiniteUserPagePosts = getInfiniteUserPagePosts;
const getInfinitePostSearchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    const scrollIndex = parseInt(req.params.scrollIndex);
    if (isNaN(scrollIndex)) {
        return yield (0, postController_1.getPosts)({
            where: { title: { contains: query, mode: "insensitive" } },
            take: TAKE_COUNT,
        }, req, res);
    }
    return yield (0, postController_1.getPosts)(Object.assign({ where: { title: { contains: query, mode: "insensitive" } } }, nextDataLogic(scrollIndex)), req, res);
});
exports.getInfinitePostSearchResult = getInfinitePostSearchResult;
const getInfiniteUserPageComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    const scrollIndex = parseInt(req.params.scrollIndex);
    if (isNaN(scrollIndex)) {
        return yield (0, userHelpers_1.sendUserCommentsFromId)(userId, { take: TAKE_COUNT }, req, res);
    }
    return yield (0, userHelpers_1.sendUserCommentsFromId)(userId, nextDataLogic(scrollIndex), req, res);
});
exports.getInfiniteUserPageComments = getInfiniteUserPageComments;
const getInfiniteCommentSearchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    const scrollIndex = parseInt(req.params.scrollIndex);
    if (isNaN(scrollIndex)) {
        return yield (0, commentHelpers_1.getCommentsFromQuery)(query, { take: TAKE_COUNT });
    }
    return yield (0, commentHelpers_1.getCommentsFromQuery)(query, nextDataLogic(scrollIndex));
});
exports.getInfiniteCommentSearchResult = getInfiniteCommentSearchResult;
const getInfiniteSubredditSearchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    let count = parseInt(req.params.count);
    const scrollIndex = parseInt(req.params.scrollIndex);
    if (isNaN(count)) {
        return res.send(app_1.app.httpErrors.badRequest("Invalid count"));
    }
    if (isNaN(scrollIndex)) {
        return yield (0, subredditHelper_1.sendSubredditSearchResult)(query, req, TAKE_COUNT);
    }
    return yield (0, subredditHelper_1.sendSubredditSearchResult)(query, req, TAKE_COUNT, nextDataLogic(scrollIndex));
});
exports.getInfiniteSubredditSearchResult = getInfiniteSubredditSearchResult;
const getInfiniteUserSearchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    const scrollIndex = parseInt(req.params.scrollIndex);
    if (isNaN(scrollIndex)) {
        const users = yield (0, userHelpers_1.getUsersFromQuery)(query, { take: TAKE_COUNT });
        const userId = req.cookies.userId;
        return yield (0, userHelpers_1.sendUsersWithFollowInfo)(userId, users);
    }
    const users = yield (0, userHelpers_1.getUsersFromQuery)(query, nextDataLogic(scrollIndex));
    const userId = req.cookies.userId;
    return yield (0, userHelpers_1.sendUsersWithFollowInfo)(userId, users);
});
exports.getInfiniteUserSearchResult = getInfiniteUserSearchResult;
