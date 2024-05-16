
// export default auth;
function auth(req, res, next) {
    const isAuthenticated = req.session && req.session.user;

    if (isAuthenticated) {
        return next();
    }

    return res.status(401).send("Error de autenticación");
}

export default auth;
