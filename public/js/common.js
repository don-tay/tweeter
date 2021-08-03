const postAndReplyTextAreas = document.querySelectorAll('#postTextarea, #replyTextarea');
postAndReplyTextAreas.forEach((textArea) => {
    textArea.addEventListener('keyup', (event) => {
        const textbox = document.getElementById(event.target.id);
        const value = textbox.value.trim();

        const isModal = !!textbox.closest('.modal');
        const submitButton = isModal ? document.getElementById('submitReplyButton') : document.getElementById('submitPostButton');

        if (!submitButton) {
            return console.error('Submit button not found');
        }

        submitButton.disabled = !value;
    });
});

const submitPostAndReplyBtn = document.querySelectorAll('#submitPostButton, #submitReplyButton');
submitPostAndReplyBtn.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
        const currBtn = document.getElementById(event.target.id);
        const isModal = !!currBtn.closest('.modal');
        const textbox = isModal ? document.getElementById('replyTextarea') : document.getElementById('postTextarea');

        const data = {
            content: textbox.value,
        };

        // for reply post, send additional replyTo field to server
        if (isModal) {
            const id = document.querySelector('div[data-id]').getAttribute('data-id');
            data.replyTo = id;
        }

        const response = await (
            await fetch('/api/posts', {
                body: JSON.stringify(data),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).json();

        if (response.data?.replyTo) {
            location.reload();
        } else {
            const html = createPostHtml(response.data);
            const postsContainer = document.querySelector('.postsContainer');
            postsContainer.innerHTML = html + postsContainer.innerHTML;
            textbox.value = '';
            currBtn.disabled = true;
        }
    });
});

$('#replyModal').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $('#submitReplyButton').data('id', postId);

    $.get(`/api/posts/${postId}`, (response, status, xhr) => {
        const originalPostContainer = document.getElementById('originalPostContainer');
        outputPosts(response.data, originalPostContainer);
    });
});

$('#replyModal').on('hidden.bs.modal', () => $('#originalPostContainer').html(''));

$('#deletePostModal').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $('#deletePostButton').data('id', postId);
});

$(document).on('click', '#deletePostButton', (event) => {
    const postId = $(event.target).data('id');

    $.ajax({
        url: `/api/posts/${postId}`,
        type: 'DELETE',
        success: (data, status, xhr) => {
            if (xhr.status !== 200) {
                console.error('Could not delete post');
            }
            location.reload();
        },
    });
});

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

$(document).on('click', '.post', (event) => {
    const elem = $(event.target);
    const postId = getPostIdFromElement(elem);

    // 2nd check handle if clicking retweet/like/reply button
    if (postId && !elem.is('button')) {
        window.location.href = `/posts/${postId}`;
    }
});

$(document).on('click', '.followButton', (event) => {
    const button = $(event.target);
    const userId = button.data().user;

    $.ajax({
        url: `/api/users/${userId}/follow`,
        type: 'PUT',
        success: (response, status, xhr) => {
            if (xhr.status === 404) {
                return;
            }

            let addToFollowersCount = 1;
            if (response.data.user?.following.includes(userId)) {
                button.addClass('following');
                button.text('Following');
            } else {
                button.removeClass('following');
                button.text('Follow');
                addToFollowersCount = -1;
            }

            const followersLabel = $('#followersValue');
            if (followersLabel.length !== 0) {
                let followersCount = parseInt(followersLabel.text());
                followersLabel.text(followersCount + addToFollowersCount);
            }
        },
    });
});

function getPostIdFromElement(elem) {
    const rootElem = elem.hasClass('post') ? elem : elem.closest('.post'); // look for root elem ie. elem with the class 'post'
    return rootElem.data().id;
}

function createPostHtml(postData, largeFont = false) {
    const {
        postedBy: { _id: postedByUserId, username, profilePic, firstName, lastName },
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
        ? `<span><i class='fas fa-retweet'></i> Retweeted by <a href='/profiles/${retweetedBy}'>@${retweetedBy}</a></span>`
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
    const largeFontClass = largeFont ? 'largeFont' : '';

    let replyFlag = '';
    if (replyTo?._id) {
        const { postedBy } = replyTo;
        const { username: replyUsername } = postedBy;

        replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profiles/${replyUsername}'>@${replyUsername}</a>
                    </div>`;
    }

    const buttons =
        postedByUserId === userLoggedIn._id
            ? `<button data-id='${postedByUserId}' data-toggle='modal' data-target='#deletePostModal'><i class='fas fa-times'></i></button>`
            : '';

    return `<div class='post ${largeFontClass}' data-id='${_id}'>
                <div class='postActionContainer'>
                    ${retweetHtml}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${profilePic}' />
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profiles/${username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${username}</span>
                            <span class='date'>${timestamp}</span>
                            ${buttons}
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
    container.innerHTML = '';

    if (!Array.isArray(postData)) {
        postData = [postData];
    }

    postData.forEach((post) => {
        const html = createPostHtml(post);
        container.innerHTML += html;
    });

    if (postData.length === 0) {
        container.innerHTML += `<span class='no-results'>Nothing to show.</span>`;
    }
}

function outputPostsWithReplies(postData, container) {
    container.innerHTML = '';

    if (postData.replyTo?._id) {
        const html = createPostHtml(postData.replyTo);
        container.innerHTML += html;
    }

    // output main post replied to
    const html = createPostHtml(postData, true);
    container.innerHTML += html;

    postData?.replies.forEach((reply) => {
        const html = createPostHtml(reply);
        container.innerHTML += html;
    });

    if (postData.length === 0) {
        container.innerHTML += `<span class='no-results'>Nothing to show.</span>`;
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
