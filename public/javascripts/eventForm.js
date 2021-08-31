let form = document.getElementById('eventForm');
console.log(form);

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        name: form.elements.name.value
    });

    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('resultContainer');
    const url = '/api/events/create';
    try {
        let response = await fetch(url, {method: 'post', headers, body});
        if(response.ok) {
            window.location.replace('/events/');
        } else {
            document.getElementById("error-container")
            .innerHTML = '<b>Something went wrong. Please contact the developer.</b>';
        }
    } catch(err) {
        console.log("Error: " + err);
        document.getElementById("error-container")
            .innerHTML = '<b>An error has occured. Please check the js file for this form.</b>';
    }
})