document.addEventListener('DOMContentLoaded', () => {
    if (selectedTab === 'posts') {
        getPosts();
    } else if (selectedTab === 'replies') {
        getReplies();
    }
});

async function getPosts() {
    const queryStr = new URLSearchParams({ postedBy: profileUserId, excludeReplies: true });
    const response = await (await fetch(`/api/posts?${queryStr}`)).json();
    const postsContainer = document.querySelector('.postsContainer');
    outputPosts(response.data, postsContainer);
}

async function getReplies() {
    const response = await (await fetch(`/api/posts/${profileUserId}/replies`)).json();
    const postsContainer = document.querySelector('.postsContainer');
    outputPosts(response.data, postsContainer);
}
