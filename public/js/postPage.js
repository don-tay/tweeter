document.addEventListener('DOMContentLoaded', async () => {
    const response = await (await fetch(`/api/posts/${postId}`)).json();
    const postsContainer = document.querySelector('.postsContainer');
    outputPostsWithReplies(response.data, postsContainer);
});
