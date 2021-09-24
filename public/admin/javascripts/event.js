
async function deleteEvent(eventId, redirect){
    let url = `/api/events/${eventId}/delete`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        });

        if(response.ok){
            alert('Delete Success');
            window.location.replace(redirect);
        } else {
            let json = await response.json();
            console.log(json);
            document.getElementById("error-container")
                .innerHTML = `<b>${json.msg}</b>`
        }
        return;
    } catch(err) {
        console.log("Error: " + err);
        document.getElementById("error-container")
            .innerHTML = `<b>Something went wrong. Check the js file.</b>`
    }

};

async function editEvent(event) {
    event.preventDefault();
    let id = event.target.elements.id.value;
    let headers = { 'Content-Type' : 'application/json' };
    let url = `/api/events/${id}/edit`;
    let body = JSON.stringify({
        id: id,
        name: event.target.elements.name.value,
        description: event.target.elements.description.value,
        status: event.target.elements.status.value,
        start: event.target.elements.start.value,
        end: event.target.elements.end.value
    });


    try {
        const response = await fetch(url, {
            headers: headers,
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            body: body
        });
        let res = await response.json();
        if(response.ok){
            alert('Edit Success');
            window.location.replace(`/admin/events/${res.event.slug}`);
        } else {
            console.log(res);
            alert("Edit failed : " + res.msg);
        }
        return;
    } catch(err) {
        console.log("Error: " + err);
        alert("Edit failed");
    }
}