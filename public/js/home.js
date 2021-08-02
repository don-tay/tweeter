document.addEventListener('DOMContentLoaded', async () => {
    const response = await (await fetch(`/api/posts?${new URLSearchParams({ followingOnly: true })}`)).json();
    const postsContainer = document.querySelector('.postsContainer');
    outputPosts(response.data, postsContainer);
});
