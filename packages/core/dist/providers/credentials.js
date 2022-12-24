var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { verifyCSRFToken } from "../encryption/csrf";
const DEFAULT_NAME = "credentials";
export function credentials(options) {
    return (baseRoutes) => {
        var _a;
        return ({
            [`${baseRoutes.signIn}/${(_a = options.name) !== null && _a !== void 0 ? _a : DEFAULT_NAME}`]: ({ req, res, config }) => __awaiter(this, void 0, void 0, function* () {
                const _b = req.body, { csrfToken } = _b, credentials = __rest(_b, ["csrfToken"]);
                const { secret } = config;
                const token = Array.isArray(csrfToken) ? csrfToken.join('') : csrfToken;
                if (verifyCSRFToken({ token, secret })) {
                    const response = yield options.authenticate(credentials);
                    if (response.type === "redirect") {
                        res.redirect(307, response.path);
                    }
                    else {
                        res.status(200).send({
                            success: response.success,
                            message: response.message
                        });
                    }
                }
                else {
                    res.status(401).end();
                }
            })
        });
    };
}
;
