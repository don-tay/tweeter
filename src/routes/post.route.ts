import express from 'express';
export const postsRouter = express.Router();

postsRouter.get('/:id', (req, res) => {
    const postId = req.params.id;
    const payload = {
        pageTitle: 'View post',
        userLoggedIn: req.session?.user,
        postId,
    };

    res.status(200).render('postPage', payload);
});
