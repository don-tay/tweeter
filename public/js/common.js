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
        console.log(response);
    });
});
