"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.earlyReturn = exports.checkEarlyReturn = void 0;
function checkEarlyReturn(userId) {
    return userId == null || userId === "";
}
exports.checkEarlyReturn = checkEarlyReturn;
function earlyReturn(container) {
    const posts = container.posts.map((post) => {
        return Object.assign(Object.assign({}, post), { likedByMe: 0 });
    });
    return Object.assign(Object.assign({}, container), { posts });
}
exports.earlyReturn = earlyReturn;
