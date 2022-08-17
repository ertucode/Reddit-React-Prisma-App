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
exports.updateSubreddit = exports.deleteSubreddit = exports.createSubreddit = exports.getSubreddit = exports.getAllSubreddits = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
// GET - /subreddits
const getAllSubreddits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.subreddit.findMany({ select: {
            id: true,
            name: true
        } }));
});
exports.getAllSubreddits = getAllSubreddits;
// GET - /user/{id}
const getSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.subreddit.findUnique({
        where: { id: req.params.id },
        select: {
            id: true,
            name: true,
            posts: {
                select: {
                    id: true,
                    title: true,
                    body: true,
                    likes: true,
                    dislikes: true,
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        }
    }));
});
exports.getSubreddit = getSubreddit;
// PUT - /subreddit
const createSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.createSubreddit = createSubreddit;
// DELETE - /user/{id}
const deleteSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.deleteSubreddit = deleteSubreddit;
// POST - /user/{id}
const updateSubreddit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.updateSubreddit = updateSubreddit;
