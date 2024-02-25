/** Voor Teun **/
/** Wanneer de pagina wordt geladen wordt het alerts scherm toegevoegd aan de DOM. **/
window.addEventListener('load', () => {
    generateAlertContainer();
})

/** Deze functie maakt een nieuwe div aan waar in notificaties worden toegevoegd (De parent div) **/
const generateAlertContainer = () => {
    let alertContainer = document.createElement('div');
    alertContainer.id = "alertContainer";
    alertContainer.classList.add("alerts");

    document.body.appendChild(alertContainer);
}

/**
 * Met deze functie kun je notificaties aanmaken, geef een type mee (system, ok, error), een titel
 * en een bericht. Deze wordt dan in de parent div '.alerts' gezet.
 **/
const createAlertBox = (type, title, message) => {
    let alertBox = document.createElement("div");
    alertBox.classList.add("alert");
    alertBox.classList.add(type);

    let alertTitle = document.createElement('h1');
    alertTitle.textContent = title;
    alertTitle.classList.add("alert-title");

    let alertText = document.createElement('p');
    alertText.textContent = message;
    alertText.classList.add("alert-msg");

    alertBox.appendChild(alertTitle);
    alertBox.appendChild(alertText);

    alertBox.addEventListener('click', () => {
       handleAlertBoxClick(alertBox);
    });

    // Na 7,5 seconden gaat het bericht vanzelf weg.
    setTimeout(() => {
        handleAlertBoxClick(alertBox);
    }, 7500);

    let alertContainer = document.getElementById('alertContainer');
    alertContainer.appendChild(alertBox);
}

/**
 * Deze functie wordt toegevoegd aan een notificatie zodat, wanneer je er op klikt de notificatie wordt verwijderd.
 **/
const handleAlertBoxClick = (alertBox) => {
    if(alertBox) {
        alertBox.remove();
    }
}