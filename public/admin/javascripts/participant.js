async function deleteParticipant(eventId, participantId, redirect) {
    let url = `/api/events/${eventId}/participants/${participantId}/delete`;
    try {
        let response = await fetch(url, {
            method: "DELETE",
        });

        if(response.ok) {
            alert('Delete success.');
            window.location.replace(redirect);
        } else {
            alert('Error: Delete failed.');
        }
    } catch(err) {
        console.log("Error: " + err);
        alert(`Something went wrong. Check the js file.`)
    }
};