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
exports.subredditRoutes = void 0;
const subredditController = __importStar(require("../controllers/subredditController"));
const subredditRoutes = (app, options, done) => {
    // Can add validator in the middle
    app.get("/subreddits", subredditController.getAllSubreddits);
    app.get("/subreddits/:id", subredditController.getSubredditById);
    app.get("/subreddit/:name", subredditController.getSubredditByName);
    app.get("/subreddit/desc_sub/:name", subredditController.getSubredditDescriptionAndSubbed);
    app.put("/subreddit/join/:name", subredditController.joinSubreddit);
    app.put("/subreddit/leave/:name", subredditController.leaveSubreddit);
    app.post("/subreddit/create/:name", subredditController.createSubreddit);
    done();
};
exports.subredditRoutes = subredditRoutes;
