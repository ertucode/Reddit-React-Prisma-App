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
exports.sendSubredditSearchResult = exports.sendSubredditsWithSubscriptionInfo = exports.addResultsFromDescription = exports.getSubredditSearchResult = void 0;
const app_1 = require("../../app");
const checkEarlyReturn_1 = require("./checkEarlyReturn");
const SUBREDDIT_SELECT = {
    id: true,
    name: true,
    description: true,
    _count: { select: { subscribedUsers: true } },
};
const getSubredditSearchResult = (query, field, extraFindManyArgs, extraWhereOptions = {}) => __awaiter(void 0, void 0, void 0, function* () {
    return yield app_1.prisma.subreddit.findMany(Object.assign({ where: Object.assign({ [field]: { contains: query, mode: "insensitive" } }, extraWhereOptions), select: Object.assign({}, SUBREDDIT_SELECT) }, extraFindManyArgs));
});
exports.getSubredditSearchResult = getSubredditSearchResult;
const addResultsFromDescription = (query, extraFindManyArgs, subreddits) => __awaiter(void 0, void 0, void 0, function* () {
    const subredditIds = subreddits.map((sub) => sub.id);
    const extraSubreddits = yield (0, exports.getSubredditSearchResult)(query, "description", extraFindManyArgs, { NOT: { id: { in: subredditIds } } });
    subreddits.push(...extraSubreddits);
});
exports.addResultsFromDescription = addResultsFromDescription;
const sendSubredditsWithSubscriptionInfo = (userId, subreddits) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(0, checkEarlyReturn_1.checkEarlyReturn)(userId)) {
        const user = yield app_1.prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                subbedTo: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const joinedSubredditIds = (_a = user === null || user === void 0 ? void 0 : user.subbedTo) === null || _a === void 0 ? void 0 : _a.map((sub) => sub.id);
        subreddits.map((sub) => {
            sub.subscribedByMe = joinedSubredditIds === null || joinedSubredditIds === void 0 ? void 0 : joinedSubredditIds.includes(sub.id);
            return sub;
        });
    }
    else {
        subreddits.map((sub) => {
            sub.subscribedByMe = false;
            return sub;
        });
    }
    return subreddits;
});
exports.sendSubredditsWithSubscriptionInfo = sendSubredditsWithSubscriptionInfo;
const sendSubredditSearchResult = (query, req, take, additionalFindManyArgs = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const subreddits = yield (0, exports.getSubredditSearchResult)(query, "name", Object.assign({ take }, additionalFindManyArgs));
    if (!(take <= subreddits.length)) {
        yield (0, exports.addResultsFromDescription)(query, Object.assign(Object.assign({}, additionalFindManyArgs), { take: take - subreddits.length }), subreddits);
    }
    const userId = req.cookies.userId;
    return yield (0, exports.sendSubredditsWithSubscriptionInfo)(userId, subreddits);
});
exports.sendSubredditSearchResult = sendSubredditSearchResult;
