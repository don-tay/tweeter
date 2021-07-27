$(document).ready(() => {
    getPosts();
});

function getPosts() {
    $.get(`/api/posts/`, { postedBy: profileUserId }, (response) => {
        outputPosts(response.data, $('.postsContainer'));
    });
}
