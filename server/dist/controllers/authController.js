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
exports.saltPassword = exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const commitToDb_1 = require("./commitToDb");
const app_1 = require("../app");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userController_1 = require("./userController");
const userHelpers_1 = require("./utils/userHelpers");
// POST - /signup
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.name === "" || req.body.name == null) {
        return res.send(app_1.app.httpErrors.badRequest("Username is required"));
    }
    const userWithSameName = yield app_1.prisma.user.findUnique({
        where: {
            name: req.body.name,
        },
    });
    if (userWithSameName != null) {
        return res.send(app_1.app.httpErrors.badRequest("Username already exists"));
    }
    const userWithSameEmail = yield app_1.prisma.user.findUnique({
        where: {
            email: req.body.email,
        },
    });
    if (userWithSameEmail != null) {
        return res.send(app_1.app.httpErrors.badRequest("Email already exists"));
    }
    const hash = saltPassword(req.body.password);
    return yield (0, commitToDb_1.commitToDb)(app_1.prisma.user.create({
        data: {
            name: req.body.name,
            password: hash,
            email: req.body.email,
        },
        select: {
            id: true,
            name: true,
        },
    }));
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.name === "" || req.body.name == null) {
        return res.send(app_1.app.httpErrors.badRequest("Username is required"));
    }
    const user = yield app_1.prisma.user.findUnique({
        where: {
            name: req.body.name,
        },
        select: Object.assign(Object.assign({}, userHelpers_1.MAIN_USER_SELECT), { password: true }),
    });
    if (user == null) {
        return res.send(app_1.app.httpErrors.badRequest("Invalid username"));
    }
    const passwordIsCorrect = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (!passwordIsCorrect) {
        return res.send(app_1.app.httpErrors.badRequest("Wrong password"));
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
    res.setCookie("userToken", token);
    const { name } = user;
    res.send({
        id: user.id,
        name,
        karma: 2 * (0, userController_1.getLikeDiff)(user.posts) + (0, userController_1.getLikeDiff)(user.comments),
    });
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setCookie("userToken", "");
});
exports.logoutUser = logoutUser;
function saltPassword(password) {
    const salt = bcrypt_1.default.genSaltSync(10);
    const hash = bcrypt_1.default.hashSync(password, salt);
    return hash;
}
exports.saltPassword = saltPassword;
