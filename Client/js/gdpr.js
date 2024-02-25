class GDPR {

    constructor() {
        this.bindEvents();
        if(this.cookieStatus() !== 'accept') this.showGDPR();
    }

    bindEvents() {
        let buttonAccept = document.querySelector('.gdpr-consent__button--accept');
        buttonAccept.addEventListener('click', () => {
            this.cookieStatus('accept');
            this.hideGDPR();
        });

        let buttonDeny = document.querySelector('.gdpr-consent__button--reject');
        buttonDeny.addEventListener('click', () => {
            this.cookieStatus('reject');
            this.hideGDPR();
        });
    }


    cookieStatus(status) {
        if (status) {
            localStorage.setItem('gdpr-consent-choice', status);
            localStorage.setItem('gdpr-consent-metadata', JSON.stringify(saveMetaData()));
        }
        return localStorage.getItem('gdpr-consent-choice');
    }

    hideGDPR(){
        document.querySelector(`.gdpr-consent`).classList.add('hide');
        document.querySelector(`.gdpr-consent`).classList.remove('show');
    }

    showGDPR(){
        document.querySelector(`.gdpr-consent`).classList.add('show');
    }
}

saveMetaData = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    return {
        datum: day + "-" + month + "-" + year,
        tijd: hours + ":" + minutes,
    };
}

const gdpr = new GDPR();
