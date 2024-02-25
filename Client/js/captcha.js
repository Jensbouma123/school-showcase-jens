let validCaptcha = false;

const onSubmitCaptcha = async () => {
    event.preventDefault();

    await checkCaptchaIsValid();
}

const checkCaptchaIsValid = async () => {

    document.getElementById('captcha-verify').innerHTML = "<div class='loader'></div>";
    document.getElementById('captcha-verify').style.pointerEvents = 'none';
    document.getElementById('captcha-verify').classList.add("disabled");

    let input = document.getElementById('captchaText');
    let text = escapeHtml(input.value);

    if(maxInputLength(input, 60) && !valueIsEmpty(text)) {
        let data = {
            CaptchaCode: text
        }
        await axios.post("https://localhost:7270/api/Captcha", data, {
            "Content-Type": "application/json"
        })
            .then(res => {
                document.getElementById('captcha-verify').innerHTML = "Geverifiëerd";
                document.getElementById('captcha-verify').style.pointerEvents = 'all';
                document.getElementById('captcha').classList.remove("error");
                document.getElementById('captcha').classList.remove("verified");
                document.getElementById('captcha').classList.add("verified");
                validCaptcha = true;
            })
            .catch(err => {
                document.getElementById('captcha-verify').innerHTML = "Opnieuw";
                document.getElementById('captcha-verify').style.pointerEvents = 'all';
                document.getElementById('captcha-verify').classList.remove("disabled");
                document.getElementById('captcha').classList.add("error");
                document.getElementById('captcha').classList.remove("verified");

                validCaptcha = false;
            });
    } else {
        document.getElementById('captcha-verify').innerHTML = " Opnieuw";
        document.getElementById('captcha-verify').style.pointerEvents = 'all';
        document.getElementById('captcha-verify').classList.remove("disabled");
        document.getElementById('captcha').classList.add("error");
        document.getElementById('captcha').classList.remove("verified");

        validCaptcha = false;

    }

    checkFormValid();
}

const resetCaptcha = () => {
    document.getElementById('captcha-verify').innerHTML = "Verifiëren";
    document.getElementById('captcha-verify').style.pointerEvents = 'all';
    document.getElementById('captcha').classList.remove("error");
    document.getElementById('captcha').classList.remove("verified");
    document.getElementById('captcha').classList.remove("verified");
}