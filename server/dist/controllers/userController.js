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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUserFromCookie = exports.deleteUser = exports.updateUser = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
const bcrypt_1 = __importDefault(require("bcrypt"));
// PUT -
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (userId !== req.cookies.userId) {
        return res.send(app_1.app.httpErrors.unauthorized("Token does not match"));
    }
    const user = yield app_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    const userWithSameName = req.body.name &&
        (yield app_1.prisma.user.findFirst({
            where: {
                name: req.body.name,
            },
        }));
    if (userWithSameName != null) {
        return res.send(app_1.app.httpErrors.badRequest("Username already exists"));
    }
    const userWithSameEmail = req.body.email &&
        (yield app_1.prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
            select: {
                name: true,
                email: true,
            },
        }));
    if (userWithSameEmail != null) {
        return res.send(app_1.app.httpErrors.badRequest("Email already exists"));
    }
    if (req.body.password) {
        const salt = bcrypt_1.default.genSaltSync(10);
        req.body.password = bcrypt_1.default.hashSync(req.body.password, salt);
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: Object.assign({}, req.body),
        select: {
            id: true,
            name: true,
            email: true,
        },
    }));
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (userId !== req.cookies.userId) {
        return res.send(app_1.app.httpErrors.unauthorized("Token does not match"));
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.delete({
        where: {
            id: userId,
        },
        select: {
            id: true,
        },
    }));
});
exports.deleteUser = deleteUser;
const getUserFromCookie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if (userId == null) {
        return res.send(app_1.app.httpErrors.badRequest("You are not logged in"));
    }
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
        },
    }));
});
exports.getUserFromCookie = getUserFromCookie;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    // Implement conditional returning of some properties
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.findUnique({
        where: {
            id: req.params.id,
        },
        select: {
            id: true,
            name: true,
            posts: true,
        },
    }));
});
exports.getUser = getUser;
