$('#postTextarea').keyup((event) => {
    const textbox = $(event.target);
    const value = textbox.val().trim();

    const submitButton = $('#submitPostButton');

    if (submitButton.length === 0) {
        return console.error('Submit button not found.');
    }

    submitButton.prop('disabled', !value);
});
