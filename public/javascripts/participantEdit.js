document.getElementById('participantEditForm')
.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    let participantId = form.elements.participantId.value;
    let eventId = form.elements.eventId.value;
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        id: participantId,
        event: eventId,
        name: form.elements.participantName.value
    });

    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('error-container');
    const url = `/api/events/${eventId}/participants/${participantId}/edit`;
    try {
        let response = await fetch(url, {method: 'put', headers, body});
        if(response.ok) {
            window.location.replace(`../../`);
        } else {
            console.log(await response.json());
            container.innerHTML = `<b>Something went wrong. Please contact the developer.</b>`;
        }
    } catch(err) {
        console.log("Error: " + err);
        container.innerHTML = '<b>An error has occured. Please check the js file for this form.</b>';
    }
})