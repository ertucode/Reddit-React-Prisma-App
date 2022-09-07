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
exports.getCommentsFromQuery = exports.SEARCH_PAGE_COMMENT_SELECT_FIELDS = void 0;
const app_1 = require("../../app");
const commitToDb_1 = require("../commitToDb");
exports.SEARCH_PAGE_COMMENT_SELECT_FIELDS = {
    select: {
        id: true,
        body: true,
        _count: { select: { likes: true, dislikes: true } },
        createdAt: true,
        post: {
            select: {
                id: true,
                title: true,
                createdAt: true,
                subreddit: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        dislikes: true,
                        comments: true,
                    },
                },
            },
        },
        user: {
            select: {
                name: true,
            },
        },
    },
};
const getCommentsFromQuery = (query, extraWhereOptions = {}, extraFindManyArgs = {}) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.comment.findMany(Object.assign(Object.assign({ where: Object.assign({ body: { contains: query, mode: "insensitive" } }, extraWhereOptions) }, exports.SEARCH_PAGE_COMMENT_SELECT_FIELDS), extraFindManyArgs)));
});
exports.getCommentsFromQuery = getCommentsFromQuery;
