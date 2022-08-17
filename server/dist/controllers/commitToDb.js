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
exports.commitToDb = void 0;
const app_1 = require("../app");
function commitToDb(promise) {
    return __awaiter(this, void 0, void 0, function* () {
        const [error, data] = yield app_1.app.to(promise);
        if (error)
            return app_1.app.httpErrors.internalServerError(error.message); // Status code 500
        return data;
    });
}
exports.commitToDb = commitToDb;
