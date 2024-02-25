let data = {};
let canSend = {};
let checked = false;
let lengthExceeded = false;

window.addEventListener('load', () => {
    let inputs = document.querySelectorAll('input');
    let textareas = document.querySelectorAll('textarea');
    let charCount = 0;
    for(let i = 0; i < inputs.length; i++) {
        if(!inputs[i].name.includes("captcha")) {
            charCount = checkMaxLengths(inputs[i]);
            inputs[i].addEventListener('keyup', (event) => {
                charCount = checkMaxLengths(inputs[i]);
                checkInputLength(event.target, charCount);
                inputCheck(event.target);
            });
            document.querySelector('.charLength.' + inputs[i].name + "Charcount").textContent = inputs[i].value.length + "/" + charCount;
        }
    }

    for(let i = 0; i < textareas.length; i++) {
        if(textareas[i].tagName.toLowerCase() === 'textarea') charCount = 600;
        textareas[i].addEventListener('keyup', (event) => {
            if(textareas[i].tagName.toLowerCase() === 'textarea') charCount = 600;
            checkInputLength(event.target, charCount);
            inputCheck(event.target);
        });
        document.querySelector('.charLength.' + textareas[i].name + "Charcount").textContent = textareas[i].value.length + "/" + charCount;
    }
});

function checkMaxLengths(input) {
    let charCount= 0;
    if(input.type === 'text' && input.name !== "subject" && input.tagName.toLowerCase() !== 'textarea') charCount = 60;
    if(input.type === 'text' && input.name === "subject") charCount = 200;
    if(input.type === 'email') charCount = 80;
    if(input.type === 'tel') charCount = 20;

    return charCount;
}

const handleForm = async (e) =>{
    e.preventDefault();
    let inputs = document.querySelectorAll('input');
    let neededInputs = [];
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i].name === canSend[inputs[i].name]) {
            data[inputs[i].name] = inputs[i].value;
            neededInputs.push(inputs[i]);
        }
    }
    if(Object.keys(data).length === neededInputs.length) {
        handleInputs(data, inputs);
    }

    createAlertBox("system", "Verzenden", "Bericht wordt verstuurd ...");

    if(checked && !lengthExceeded && validCaptcha) {
        document.getElementById('send-btn').innerHTML = "<div class='loader'></div>";
        document.getElementById('send-btn').style.pointerEvents = 'none';
        document.getElementById('send-btn').classList.add("disabled");
        e.target.readOnly = true;
        await axios.post("https://localhost:7270/api/MailContact", data, {
            "Content-Type": "application/json"
        })
            .then(res => {
                document.getElementById('send-btn').innerHTML = "Verstuur";
                document.getElementById('send-btn').style.pointerEvents = 'all';
                document.getElementById('send-btn').classList.remove("disabled");
                e.target.readOnly = false;
                e.target.reset();
                resetCaptcha();
                createAlertBox("ok", "Verzonden", "Bericht is verstuurd!");
            })
            .catch(err => {
                console.log(err);
                document.getElementById('send-btn').innerHTML = "Verstuur";
                document.getElementById('send-btn').style.pointerEvents = 'all';
                document.getElementById('send-btn').classList.remove("disabled");
                e.target.readOnly = false;
                resetCaptcha();
                createAlertBox("error", "Mislukt", "Er is iets mis gegaan bij het versturen. Probeer het later opnieuw.");
            });
    } else {
        resetCaptcha();
        createAlertBox("error", "Waardes ongeldig", "Ongeldige waardes in invoervelden. Controlleer deze om het nog een keer te proberen.");
    }
}

function handleInputs(data, inputs) {
    for(let i = 0; i < inputs.length - 1; i++) {
        inputCheck(inputs[i]);
    }
}

function inputCheck(input) {

    if (Object.keys(canSend).length === 0) {
        let inputs = input.closest("form").elements;
        for (let i = 0; i < inputs.length - 1; i++) {
            if(!inputs[i].name.includes("captcha")) {
                canSend[inputs[i].name] = false;
            }
        }
    }

    if (!valueIsEmpty(input.value)) {
        input.classList.remove('error');
        if (input.type) {
            if (input.type === 'tel') {
                if (inputCheckTel(input) && maxInputLength(input, 20)) {
                    data[input.name] = input.value;
                    canSend[input.name] = true;
                } else {
                    canSend[input.name] = false;
                }
            } else if (input.type === 'email') {
                if (inputCheckEmail(input) && maxInputLength(input, 80)) {
                    data[input.name] = input.value;
                    canSend[input.name] = true;
                } else {
                    canSend[input.name] = false;
                }
            } else if ((input.type === 'text' && input.name === 'subject') && maxInputLength(input, 200)) {
                data[input.name] = inputCheckText(input);
                canSend[input.name] = true;
            } else if ((input.type === 'text' && input.name !== 'subject' && input.tagName.toLowerCase() !== 'textarea') && maxInputLength(input, 60)) {
                data[input.name] = inputCheckText(input);
                canSend[input.name] = true;
            } else if(input.tagName.toLowerCase() === 'textarea' && maxInputLength(input, 600)) {
                data[input.name] = inputCheckText(input);
                canSend[input.name] = true;
            } else {
                input.classList.add('error');
            }
        }
    } else {
        input.classList.add('error');
        canSend[input.name] = false;
    }

    for (const key in canSend) {
        if (canSend.hasOwnProperty(key)) {
            if (canSend[key] === true) {
                checked = true;
            } else {
                checked = false;
                return;
            }
        }
    }

    checkFormValid();
}

function valueIsEmpty(value) {
    return value === undefined || value === null || value === "";
}

function maxInputLength(input, maxLength) {
    return input.value.length <= maxLength;
}

function checkInputLength(input, maxLength) {
    document.querySelector('.charLength.' + input.name + "Charcount").textContent = input.value.length + "/" + maxLength;
    if(input.value.length > maxLength) {
        document.querySelector('.charLength.' + input.name + "Charcount").classList.add("error");
        lengthExceeded = true;
    } else {
        lengthExceeded = false;
        document.querySelector('.charLength.' + input.name + "Charcount").classList.remove("error");
    }
}

function inputCheckTel(input) {
    let phoneNumberRegex = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9,20}$|[0-9\-\s]{10,20}$)/;

    if (phoneNumberRegex.test(input.value) && input.value.length >= 10 && input.value.length <= 20) {
        input.classList.remove('error');
        return true;
    } else {
        input.classList.add('error');
        return false;
    }
}


function inputCheckEmail(input) {
    if(input.value.match(/^\S+@\S+\.\S{2,}$/g)) {
        input.classList.remove('error');
        return true;
    } else {
        input.classList.add('error');
        return false;
    }
}

const checkFormValid = () => {
    if (checked && !lengthExceeded && validCaptcha) {
        document.getElementById('send-btn').classList.remove("disabled");
        document.getElementById('send-btn').style.pointerEvents = 'all';
    } else {
        document.getElementById('send-btn').classList.add("disabled");
        document.getElementById('send-btn').style.pointerEvents = 'none';
    }
}

function inputCheckText(input) {
    return escapeHtml(input.value);
}

function escapeHtml(text)
{
    return text
        .replace("</script>", "")
        .replace("<script>", "")
        .replace(/`/g, "");
}
