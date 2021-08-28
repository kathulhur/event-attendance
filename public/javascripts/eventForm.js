let form = document.getElementById('eventForm');
console.log(form);

form.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        name: form.elements.eventName.value
    });

    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('resultContainer');
    fetch('/api/events', {method: 'post', headers, body})
        .then(resp => {
            if(resp.status < 200 || resp.status >= 300)
                throw new Error(`Request failed with status ${resp.status}`)
            return resp.json();
        })
        .then (json => {
            container.innerHTML = '<b> Thank you for signing up!</b>'
        })
        .catch(err => {
            container.innerHTML = `We're sorry, we had a problem ` +
                `signing you up. Please <a href="/attendance">try again</a>`;
        })
})