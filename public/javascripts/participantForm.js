let form = document.getElementById('participantForm');
console.log(form);

form.addEventListener('submit', async event => {
    event.preventDefault();
    
    const form = event.target;
    const body = JSON.stringify({
        _csrf: form.elements._csrf.value,
        event: form.elements.event.value,
        name: form.elements.name.value,
    });
    
    const headers = { 'Content-Type': 'application/json' }
    const container = document.getElementById('resultContainer');

    let errorContainer = document.getElementById('error-container');
    try{
        let response = await fetch(`/api/events/${form.elements.event.value}/participants`, {method: 'post', headers, body});
        if(response.ok){
            window.location.replace(`/events/${form.elements.event.value}`);
        } else {
            errorContainer.innerHTML = '<b>Something went wrong. Please contact the developer.</b>';
        }
    } catch(err){
        console.log("Error: " + err);
        errorContainer.innerHTML = '<b>Error occured. Please check participantForm.js<b>'
    }

});
function exposed() {
    console.log("this is an exposed function");
}