$(document).ready(() => {
    $.get(`/api/posts/${postId}`, (res) => {
        outputPosts(res, $('.postsContainer'));
    });
});
