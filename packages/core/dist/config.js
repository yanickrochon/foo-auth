import { sessionRoutes } from './api/session';
import { csrfRoutes } from './api/csrf';
function checkDuplicateRoutes(...allRoutes) {
    const paths = new Set();
    for (const routes of allRoutes) {
        for (const routePath in routes) {
            if (paths.has(routePath)) {
                throw new Error(`Duplicate route : ${routePath}`);
            }
            paths.add(routePath);
        }
    }
}
export function createFooAuth(server, config) {
    const routes = Object.assign(Object.assign({}, sessionRoutes()), csrfRoutes());
    checkDuplicateRoutes(routes, ...config.providers);
    // register routes
    if (config.providers) {
        for (const provider of config.providers) {
            for (const routePath in provider) {
                routes[routePath] = provider[routePath];
            }
        }
    }
}
;
