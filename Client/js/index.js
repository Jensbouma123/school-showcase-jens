window.addEventListener('load', () => {
    handleNav("skills", true);
});

function handleNav(option, loaded) {
    let block = null;
    let containers = document.querySelectorAll('.container');

    containers.forEach(container => {
        container.classList.add('hidden');
        container.classList.remove('visible');
        let navLink = document.getElementById(container.id + "Btn");
        if(navLink) navLink.classList.remove('current');
    })

    if(option) {
        block = document.getElementById(option);
        block.classList.remove('hidden');
        block.classList.add('visible');

        document.getElementById(option + 'Btn').classList.add('current');
        if(!loaded) block.scrollIntoView(true);
    }
}

function handleMenu() {
    let nav = document.getElementById('nav');
    let navLinks = nav.querySelectorAll('.nav-link');
    for(let i = 0; i < navLinks.length - 1; i++) {
        if(navLinks[i].classList.contains('open')) {
            navLinks[i].classList.remove('open');
        } else {
            navLinks[i].classList.add('open');
        }
    }
}