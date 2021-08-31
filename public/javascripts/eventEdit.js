let form = document.getElementById('eventEditForm');
console.log(form);

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        event: form.elements.event.value,
        name: form.elements.name.value
    });

    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('resultContainer');
    const url = `/api/events/${form.elements.event.value}/edit`;
    try {
        let response = await fetch(url, {method: 'put', headers, body});
        if(response.ok) {
            window.location.replace(`/events/${form.elements.event.value}`);
        } else {
            console.log(await response.json());
            document.getElementById("error-container")
            .innerHTML = `<b>Something went wrong. Please contact the developer.</b>`;
        }
    } catch(err) {
        console.log("Error: " + err);
        document.getElementById("error-container")
            .innerHTML = '<b>An error has occured. Please check the js file for this form.</b>';
    }
})