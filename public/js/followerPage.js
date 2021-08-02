$(document).ready(() => {
    if (selectedTab === 'followers') {
        getFollowers();
    } else if (selectedTab === 'following') {
        getFollowing();
    }
});

async function getFollowers() {
    const response = await (await fetch(`/api/users/${profileUserId}/followers`)).json();
    const resultsContainer = document.querySelector('.resultsContainer');
    outputUsers(response.data?.followers, resultsContainer);
}

async function getFollowing() {
    const response = await (await fetch(`/api/users/${profileUserId}/following`)).json();
    const resultsContainer = document.querySelector('.resultsContainer');
    outputUsers(response.data?.following, resultsContainer);
}

function outputUsers(data, container) {
    container.innerHTML = '';

    data.forEach((d) => {
        const html = createUserHtml(d, true);
        container.innerHTML += html;
    });

    if (data.length === 0) {
        container.innerHTML += `<span class='no-results'>No results found</span>`;
    }
}

function createUserHtml(userData, showFollowBtn) {
    const name = `${userData.firstName} ${userData.lastName}`;
    const isFollowing = userLoggedIn?.following.includes(userData._id);
    const text = isFollowing ? 'Following' : 'Follow';
    const buttonClass = isFollowing ? 'followButton following' : 'followButton';
    let followBtn = '';
    if (showFollowBtn && userLoggedIn._id !== userData._id) {
        followBtn = `<div class='followButtonContainer'>
                        <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                    </div>`;
    }

    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>
                    </div>
                </div>
                ${followBtn}
            </div>`;
}
