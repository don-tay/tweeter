$('#postTextarea, #replyTextarea').keyup((event) => {
    const textbox = $(event.target);
    const value = textbox.val().trim();

    const isModal = textbox.parents('.modal').length === 1;
    const submitButton = isModal ? $('#submitReplyButton') : $('#submitPostButton');

    if (submitButton.length === 0) {
        return console.error('Submit button not found.');
    }

    submitButton.prop('disabled', !value);
});

$('#submitPostButton, #submitReplyButton').click((event) => {
    const button = $(event.target);

    const isModal = button.parents('.modal').length === 1;
    const textbox = isModal ? $('#replyTextarea') : $('#postTextarea');

    const data = {
        content: textbox.val(),
    };

    // for reply post, send additional replyTo field to server
    if (isModal) {
        const id = button.data()?.id;
        data.replyTo = id;
    }

    $.post('/api/posts', data, (response, status, xhr) => {
        if (response.data?.replyTo) {
            location.reload();
        } else {
            const html = createPostHtml(response.data);
            $('.postsContainer').prepend(html);
            textbox.val('');
            button.prop('disabled', true);
        }
    });
});

$('#replyModal').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $('#submitReplyButton').data('id', postId);

    $.get(`/api/posts/${postId}`, (response, status, xhr) => {
        outputPosts(response.data, $('#originalPostContainer'));
    });
});

$('#replyModal').on('hidden.bs.modal', () => $('#originalPostContainer').html(''));

$(document).on('click', '.likeButton', (event) => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);
    if (!postId) {
        return console.error('Post id not found');
    }

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: 'PUT',
        success: (response) => {
            const { userLikes } = response.data;
            button.find('span').text(userLikes.length || '');
            if (userLikes.includes(userLoggedIn._id)) {
                button.addClass('active');
            } else {
                button.removeClass('active');
            }
        },
    });
});

$(document).on('click', '.retweetButton', (event) => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);
    if (!postId) {
        return console.error('Post id not found');
    }

    const data = { postId };

    $.post('/api/posts/retweet', data, (response, status, xhr) => {
        const {
            originalPost: { userRetweets },
            // retweetPost,
        } = response.data;
        button.find('span').text(userRetweets.length || '');
        if (userRetweets.includes(userLoggedIn._id)) {
            button.addClass('active');
            // TODO: implement show new retweet post on retweet button click. Require backend to populate relevant retweet fields
            // const html = createPostHtml(retweetPost);
            // $('.postsContainer').prepend(html);
        } else {
            button.removeClass('active');
        }
    });
});

function getPostIdFromElement(elem) {
    const rootElem = elem.hasClass('post') ? elem : elem.closest('.post'); // look for root elem ie. elem with the class 'post'
    return rootElem.data().id;
}

function createPostHtml(postData) {
    const {
        postedBy: { username, profilePic, firstName, lastName },
        content,
        createdAt,
        userLikes,
        userRetweets,
        retweetData,
        _id,
        replyTo,
    } = postData;

    const isRetweet = !!retweetData;
    const retweetedBy = isRetweet ? username : null;

    const retweetHtml = isRetweet
        ? `<span><i class='fas fa-retweet'></i> Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a></span>`
        : '';

    let bodyText = isRetweet ? retweetData?.content : content;
    let bodyTextClass = '';

    // if bodyText is undefined, show default 'Post has been deleted' text
    if (!bodyText) {
        bodyText = 'Post has been deleted';
        bodyTextClass = 'deletedBodyText';
    }

    const displayName = firstName + ' ' + lastName;
    const timestamp = timeDifference(new Date(), new Date(createdAt));

    const likeButtonActiveClass = userLikes.includes(userLoggedIn._id) ? 'active' : '';
    const retweetButtonActiveClass = userRetweets.includes(userLoggedIn._id) ? 'active' : '';

    let replyFlag = '';
    if (replyTo) {
        const { postedBy } = replyTo;
        const { username: replyUsername } = postedBy;

        replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profile/${replyUsername}'>@${replyUsername}</a>
                    </div>`;
    }

    return `<div class='post' data-id='${_id}'>
                <div class='postActionContainer'>
                    ${retweetHtml}
                </div>
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
                        ${replyFlag}
                        <div class='postBody'>
                            <span class='${bodyTextClass}'>${bodyText}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button data-toggle='modal' data-target='#replyModal'>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class='retweetButton ${retweetButtonActiveClass}'>
                                    <i class='fas fa-retweet'></i>
                                    <span>${userRetweets.length || ''}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='far fa-heart'></i>
                                    <span>${userLikes.length || ''}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

function outputPosts(postData, container) {
    container.html('');

    if (!Array.isArray(postData)) {
        postData = [postData];
    }

    postData.forEach((post) => {
        const html = createPostHtml(post);
        container.append(html);
    });

    if (postData.length === 0) {
        container.append(`<span class='noResults'>Nothing to show.</span>`);
    }
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
