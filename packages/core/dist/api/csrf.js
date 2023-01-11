import { createCSRFToken } from '../encryption/csrf';
export function csrfRoutes(baseRoutes) {
    return {
        [baseRoutes.csrfToken]: ({ res }) => {
            const csrfToken = createCSRFToken();
            res.status(200).send({ csrfToken });
        }
    };
}
