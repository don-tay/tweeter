$(document).ready(() => {
    $.get(`/api/posts/${postId}`, (response) => {
        outputPostsWithReplies(response.data, $('.postsContainer'));
    });
});
