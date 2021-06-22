const updateButton = document.querySelector('#update-button');
const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');

updateButton.addEventListener('click', () => {
    fetch('/quotes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.'
        }),
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(response => {
        console.log(response);
        window.location.reload();
    })
})

deleteButton.addEventListener('click', () => {
    fetch('/quotes', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Darth Vader',
        })
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(response => {
        if (response === 'No quote to delete') {
            messageDiv.textContent = 'No more Darth Vader quotes to delete';
        } else {
            window.location.reload();
        }
    })
})