export function authRoutes(baseRoutes) {
    return {
        [baseRoutes.signOut]: ({ res, session }) => {
            session.clearSession();
            res.status(200).send({
                success: true
            });
        }
    };
}
