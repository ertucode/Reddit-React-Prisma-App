"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infiniteRoutes = void 0;
const infiniteScrollController = __importStar(require("../controllers/infiniteScrollController"));
const infiniteRoutes = (app, options, done) => {
    // Can add validator in the middle
    app.get("/infinite/posts/all_posts/:createdAt", infiniteScrollController.getInfiniteAllPosts);
    app.get("/infinite/posts/homepage/:createdAt", infiniteScrollController.getInfiniteHomePagePosts);
    app.get("/infinite/posts/user/:createdAt/:userName", infiniteScrollController.getInfiniteUserPagePosts);
    app.get("/infinite/search/post/:query/:createdAt", infiniteScrollController.getInfinitePostSearchResult);
    app.get("/infinite/search/comment/:query/:createdAt", infiniteScrollController.getInfiniteCommentSearchResult);
    app.get("/infinite/search/subreddit/:query/:createdAt", infiniteScrollController.getInfiniteSubredditSearchResult);
    app.get("/infinite/search/user/:query/:createdAt", infiniteScrollController.getInfiniteUserSearchResult);
    app.get("/infinite/comments/user/:createdAt/:userName", infiniteScrollController.getInfiniteUserPageComments);
    done();
};
exports.infiniteRoutes = infiniteRoutes;
