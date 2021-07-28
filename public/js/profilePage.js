$(document).ready(() => {
    if (selectedTab === 'posts') {
        getPosts();
    } else if (selectedTab === 'replies') {
        getReplies();
    }
});

function getPosts() {
    $.get(`/api/posts`, { postedBy: profileUserId, excludeReplies: true }, (response) => {
        outputPosts(response.data, $('.postsContainer'));
    });
}

function getReplies() {
    $.get(`/api/posts/${profileUserId}/replies`, (response) => {
        outputPosts(response.data, $('.postsContainer'));
    });
}
