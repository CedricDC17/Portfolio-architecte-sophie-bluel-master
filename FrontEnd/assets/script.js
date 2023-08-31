document.addEventListener('DOMContentLoaded', function () {

    let works; // Declare works globally
    let filtreObjets = [];
    let filtreApt = [];
    let filtreHR = [];
    const adminEmail = "sophie.bluel@test.tld";
    const adminPassword = "S0phie";

    async function logWorks() {
        let response = await fetch('http://localhost:5678/api/works');
        let worksData = await response.json();
        return worksData;
    }

    logWorks().then(result => {
        works = result;
        console.log(works);
        //récuperer les travaux de chaques catégories
        works.forEach(work => {
            if (work.categoryId === 1) {
                filtreObjets.push(work);
            }
            if (work.categoryId === 2) {
                filtreApt.push(work);
            }
            if (work.categoryId === 3) {
                filtreHR.push(work);
            }
        })
        // const filtreAppartement = works.filter(work => {
        //     work.categoryId === 2;
        // })

        //récupère les boutons du html
        const boutonFiltreObjets = document.getElementById('objets')
        const boutonFiltreApt = document.getElementById('appartements')
        const boutonFiltreHR = document.getElementById('hotels-restaurants')
        const boutonTous = document.getElementById('travaux')
        //récupère la div classe gallery
        const sectionGallery = document.querySelector(".gallery");

        //afficher tous les travaux au chargement
        affichageTravaux(works);

        //button qui appelle la fonction pour afficher la bonne catégorie de travaux
        boutonFiltreObjets.addEventListener('click', function () {
            affichageTravaux(filtreObjets);
        })
        boutonFiltreApt.addEventListener('click', function () {
            affichageTravaux(filtreApt);
        })
        boutonFiltreHR.addEventListener('click', function () {
            affichageTravaux(filtreHR);
        })
        boutonTous.addEventListener('click', function () {
            affichageTravaux(works);
        })

        //supprime tous les travaux et les remplacent par une catégorie en paramètre
        function affichageTravaux(list) {
            while (sectionGallery.firstChild) {
                sectionGallery.removeChild(sectionGallery.firstChild);
            }
            list.forEach(work => {
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                imageElement.src = work.imageUrl;
                const titleElement = document.createElement("figcaption");
                titleElement.textContent = work.title;

                sectionGallery.appendChild(figureElement);
                figureElement.appendChild(imageElement);
                figureElement.appendChild(titleElement);
            });
        }
    });

    const anchorLinks = document.querySelectorAll('a.anchor-link');

    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = link.getAttribute('href'); // e.g., "#about"
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const form = document.getElementById('login-form');

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        // Assuming your response contains userId and token properties
        const userId = result.userId;
        const token = result.token;

        console.log("User:", result);
    } catch (error) {
        console.error("Error:", error);
    }
});





});