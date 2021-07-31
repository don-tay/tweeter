$(document).ready(() => {
    $.get('/api/posts', { followingOnly: true }, (response, status, xhr) => {
        outputPosts(response.data, $('.postsContainer'));
    });
});
