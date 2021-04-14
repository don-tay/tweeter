export const requireLogin = (req, res, next) => {
    if (req.session?.user) {
        return next();
    } else {
        console.error('No session found');
        return res.redirect('/auth/login');
    }
};
