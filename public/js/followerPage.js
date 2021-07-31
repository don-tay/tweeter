$(document).ready(() => {
    if (selectedTab === 'followers') {
        getFollowers();
    } else if (selectedTab === 'following') {
        getFollowing();
    }
});

function getFollowers() {
    $.get(`/api/users/${profileUserId}/followers`, (response) => {
        outputUsers(response.data, $('.resultsContainer'));
    });
}

function getFollowing() {
    $.get(`/api/users/${profileUserId}/following`, (response) => {
        outputUsers(response.data, $('.resultsContainer'));
    });
}

function outputUsers(data, container) {
    console.log(data);
}
