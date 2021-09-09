
document.getElementById('eventEditForm')
.addEventListener('submit', async function (event){
    event.preventDefault();
    let eventId = event.target.elements.eventId.value;

    let headers = { 'Content-Type' : 'application/json' };
    let url = `/api/events/${eventId}/edit`;
    let body = JSON.stringify({
        name: event.target.elements.name.value,
    });


    try {
        const response = await fetch(url, {
            headers: headers,
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            body: body
        });

        if(response.ok){
            alert('Edit success')
            window.location.replace(`/admin/events/${eventId}`);
        } else {
            alert("Edit failed");
        }
        return;
    } catch(err) {
        console.log("Error: " + err);
        alert("Edit failed");
    }
    

});