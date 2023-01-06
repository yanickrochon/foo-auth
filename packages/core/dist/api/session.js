export function sessionRoutes(baseRoutes) {
    return {
        [baseRoutes.session]: ({ res, session }) => {
            const sessionToken = session.getSessionToken();
            const sessionValue = session.getSession();
            res.status(200).send({
                success: true,
                token: sessionToken,
                session: sessionValue
            });
        }
    };
}
