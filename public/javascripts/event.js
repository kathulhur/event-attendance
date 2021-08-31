
document.getElementById('delete-event-btn')
.addEventListener('click', async function (event){
    event.preventDefault();
    let eventId = this.getAttribute('data-event-id'),
        eventName = this.getAttribute('data-event-name');

    let url = `/api/events/${eventId}/delete`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        });

        if(response.ok){
            window.location.replace('/events/');
        } else {
            let json = await response.json();
            document.getElementById("error-container")
                .innerHTML = `<b>${json.msg}</b>`
        }
        return;
    } catch(err) {
        console.log("Error: " + err);
        document.getElementById("error-container")
            .innerHTML = `<b>Something went wrong. Check the js file.</b>`
    }
    

});

document.getElementById('delete-participant-btn')
.addEventListener('click', async function(event) {
    event.preventDefault();
    let data = document.getElementById('delete-event-btn');

    let participantId = this.getAttribute('data-participant-id'),
        participantName = this.getAttribute('data-participant-name'),
        eventId = data.getAttribute('data-event-id'),
        eventName = data.getAttribute('data-event-name');

    let url = `/api/events/${eventId}/participants/${participantId}`;

    try {
        let response = await fetch(url, {
            method: "DELETE",
        });

        if(response.ok) {
            alert('Delete success.');
            window.location.reload();
        } else {
            alert('Error: Delete failed.');
        }
    } catch(err) {
        console.log("Error: " + err);
        alert(`Something went wrong. Check the js file.`)
    }
});