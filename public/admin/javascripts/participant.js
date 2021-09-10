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

async function editParticipant(event) {
    event.preventDefault();
    let eventId = event.target.elements.event.value,
        participantId = event.target.elements.id.value;

    let headers = { 'Content-Type' : 'application/json' };
    let url = `/api/events/${eventId}/participants/${participantId}/edit`;
    let body = JSON.stringify({
        id: participantId,
        event: eventId,
        name: event.target.elements.name.value,
        age: event.target.elements.age.value,
        course: event.target.elements.course.value,
        institution: event.target.elements.institution.value
    });


    try {
        const response = await fetch(url, {
            headers: headers,
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            body: body
        });

        if(response.ok){
            let res = await response.json();    
            window.location.replace(`/admin/events/${res.participant.event.slug}/participants/${res.participant.slug}`);
        } else {
            alert("Edit failed");
        }
        return;
    } catch(err) {
        console.log("Error: " + err);
        alert("Edit failed");
    }
}