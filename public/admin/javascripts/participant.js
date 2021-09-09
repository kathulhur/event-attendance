document.getElementById('deleteParticipantBtn')
.addEventListener('click', async function(event) {
    event.preventDefault();
    let eventId = this.dataset.eventId;
    let participantId = this.dataset.participantId;

    let url = `/api/events/${eventId}/participants/${participantId}/delete`;

    try {
        let response = await fetch(url, {
            method: "DELETE",
        });

        if(response.ok) {
            alert('Delete success.');
            window.location.replace('../../');
        } else {
            alert('Error: Delete failed.');
        }
    } catch(err) {
        console.log("Error: " + err);
        alert(`Something went wrong. Check the js file.`)
    }
});