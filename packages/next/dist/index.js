var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getRoutes, Cookies } from '@foo-auth/core';
export default function fooAuthNext(config) {
    const server = {
        getCookies(req, res) {
            return new Cookies(req, res);
        },
        getRequest(req) {
            return {
                query: req.query,
                body: req.body
            };
        },
        getResponse(res) {
            const response = {
                redirect(statusCode, url) {
                    if (typeof statusCode === 'string') {
                        res.redirect(statusCode);
                    }
                    else {
                        res.redirect(statusCode, url);
                    }
                    return response;
                },
                status(statusCode) {
                    res.status(statusCode);
                    return response;
                },
                send(body) {
                    res.send(body);
                    return response;
                },
                end(cb) {
                    res.end(cb);
                    return response;
                }
            };
            return response;
        }
    };
    const apiRoutes = getRoutes(config);
    return (_req, _res) => __awaiter(this, void 0, void 0, function* () {
        const { auth: params = [] } = _req.query || {};
        const routeName = (Array.isArray(params) ? `/${params.join('/')}` : params);
        const routeFn = apiRoutes[routeName];
        //console.log(routeName, apiRoutes);
        if (routeFn) {
            const req = server.getRequest(_req);
            const res = server.getResponse(_res);
            const cookies = server.getCookies(_req, _res);
            const session = config.session({ req, res, cookies });
            yield routeFn({ req, res, config, cookies, session });
        }
        if (!_res.headersSent) {
            _res.status(404).end();
        }
    });
}
;
