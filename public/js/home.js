$(document).ready(() => {
    $.get('/api/posts', (response, status, xhr) => {
        outputPosts(response.data, $('.postsContainer'));
    });
});
