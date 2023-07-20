module.exports = (req, res, next) => {
    if (req.session.currentUser.admin) {
        next();
    } else {
        res.redirect("/no-admin");
    }
};