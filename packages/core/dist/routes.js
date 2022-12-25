import { authRoutes } from './api/auth';
import { sessionRoutes } from './api/session';
import { csrfRoutes } from './api/csrf';
const defaultBaseRoutes = {
    callback: '/callback',
    csrfToken: '/csrf-token',
    session: '/session',
    signIn: '/sign-in',
    signOut: '/sign-out',
};
export function getRoutes(config) {
    const baseRoutes = Object.assign(Object.assign({}, defaultBaseRoutes), config.baseRoutes);
    const routes = Object.assign(Object.assign(Object.assign({}, authRoutes(baseRoutes)), sessionRoutes(baseRoutes)), csrfRoutes(baseRoutes));
    // register routes
    if (config.providers) {
        for (const providerInit of config.providers) {
            const provider = providerInit(baseRoutes);
            for (const routePath in provider) {
                if (routePath in routes) {
                    throw new Error(`Duplicate route : ${routePath}`);
                }
                routes[routePath] = provider[routePath];
            }
        }
    }
    return routes;
}
;
