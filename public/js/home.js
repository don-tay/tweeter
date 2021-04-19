$(document).ready(() => {
    $.get('/api/posts', (response, status, xhr) => {
        outputPosts(response.data, $('.postsContainer'));
    });
});

function outputPosts(postData, container) {
    container.html('');

    postData.forEach((post) => {
        const html = createPostHtml(post);
        container.append(html);
    });

    if (postData.length === 0) {
        container.append(`<span class='noResults'>Nothing to show.</span>`);
    }
}
