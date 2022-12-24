import { createCSRFToken } from '../encryption/csrf';
export function csrfRoutes(baseRoutes) {
    return {
        [baseRoutes.csrfToken]: ({ res, config }) => {
            const { secret } = config;
            const csrfToken = createCSRFToken({ secret });
            res.status(200).send({ csrfToken });
        }
    };
}
