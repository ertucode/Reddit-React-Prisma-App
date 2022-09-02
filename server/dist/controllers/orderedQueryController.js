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
exports.getInfiniteAllPostsWithOrder = void 0;
const app_1 = require("../app");
const postController_1 = require("./postController");
const DEFAULT_TAKE = 20;
// IN WORK
const getInfiniteAllPostsWithOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderBy = req.params.orderBy;
    const cursor = req.params.cursor;
    let take = parseInt(req.params.take);
    if (isNaN(take)) {
        take = DEFAULT_TAKE;
    }
    if (cursor == null) {
        return yield (0, postController_1.getPosts)({ take }, req, res);
    }
    if (orderBy === "date") {
        return yield (0, postController_1.getPosts)({ take, where: { createdAt: { lte: cursor } } }, req, res);
    }
    else if (orderBy === "likes") {
    }
    yield app_1.prisma.post.findMany({});
});
exports.getInfiniteAllPostsWithOrder = getInfiniteAllPostsWithOrder;
