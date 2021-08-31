document.getElementById('delete-participant-btn')
.addEventListener('click', async function(event) {
    event.preventDefault();
    let data = document.getElementById('delete-event-btn');


    let url = '/api' + window.location.pathname;

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