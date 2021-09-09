
document.getElementById('deleteBtn')
.addEventListener('click', async function (event){
    event.preventDefault();
    let eventId = this.dataset.eventId;

    let url = `/api/events/${eventId}/delete`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        });

        if(response.ok){
            alert('Delete success')
            window.location.replace('/admin/events');
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