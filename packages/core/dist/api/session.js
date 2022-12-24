export function sessionRoutes(baseRoutes) {
    return {
        [baseRoutes.session]: ({ res, session }) => {
            const sessionValue = session.getSession();
            // TODO : return session token
            res.status(200).send({
                success: true,
                session: sessionValue
            });
        }
    };
}
