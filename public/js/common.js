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
    const { postedBy, createdAt } = postData;
    const displayName = postedBy.firstName + ' ' + postedBy.lastName;
    return `<div class='post'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}' />
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${createdAt}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
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
