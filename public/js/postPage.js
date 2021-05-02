$(document).ready(() => {
    $.get(`/api/posts/${postId}`, (response) => {
        outputPosts(response.data, $('.postsContainer'));
    });
});
