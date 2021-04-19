$('#postTextarea').keyup((event) => {
    const textbox = $(event.target);
    const value = textbox.val().trim();

    const submitButton = $('#submitPostButton');

    if (submitButton.length === 0) {
        return console.error('Submit button not found.');
    }

    submitButton.prop('disabled', !value);
});

$('#submitPostButton').click((event) => {
    const button = $(event.target);
    const textbox = $('#postTextarea');

    const data = {
        content: textbox.val(),
    };

    $.post('/api/posts', data, (response, status, xhr) => {
        const html = createPostHtml(response.data);
        $('.postsContainer').prepend(html);
        textbox.val('');
        button.prop('disabled', true);
    });
});

function createPostHtml(postData) {
    const {
        postedBy: { username, profilePic, firstName, lastName },
        content,
        createdAt,
    } = postData;
    const displayName = firstName + ' ' + lastName;
    const timestamp = timeDifference(new Date(), new Date(createdAt));
    return `<div class='post'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${profilePic}' />
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='far fa-heart'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed / 1000 < 30) {
        return 'Just now';
    } else if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}
