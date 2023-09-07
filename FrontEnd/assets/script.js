document.addEventListener('DOMContentLoaded', function () {

    let works; // Declare works globally
    let filtreObjets = [];
    let filtreApt = [];
    let filtreHR = [];
    const adminEmail = "sophie.bluel@test.tld";
    const adminPassword = "S0phie";
    const currentUrl = window.location.href;
    const userID = localStorage.getItem('userId');
    const token = localStorage.getItem('token');


    if (currentUrl === "http://localhost:5678/") {
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

            //afficher la galerie dans la modale 
            const modalGallery = document.getElementById('modal-gallery');
            works.forEach(function (work) {
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                imageElement.classList.add('modal-img')
                imageElement.src = work.imageUrl;
                const titleElement = document.createElement("figcaption");
                titleElement.textContent = "éditer";

                modalGallery.appendChild(figureElement);
                figureElement.appendChild(imageElement);
                figureElement.appendChild(titleElement);
            })

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

        console.log("L'id utilisateur est: " + userID + " et le token est: " + token)
        //smooth scroll
        const anchorLinks = document.querySelectorAll('a.anchor-link');
        anchorLinks.forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        //récup le lien du bouton login/logout
        const logBtn = document.getElementById('log');
        //supprime userID du storage si =1 et recharge la page
        logBtn.addEventListener('click', function () {
            if (userID === "1") {
                localStorage.removeItem('userId');
                logBtn.href = "/";
            }
        })

        //chargement de la page si mode admin
        if (userID === "1") {
            //création des elements d'admin bar
            logBtn.textContent = "Logout";
            const adminBar = document.createElement('div');
            adminBar.classList.add('admin-bar');
            const innerDiv = document.createElement('div');
            const icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-pen-to-square');
            const span = document.createElement('span');
            span.textContent = 'Mode édition';
            const button = document.createElement('button');
            button.textContent = 'Publier les changements';

            
            innerDiv.appendChild(icon);
            innerDiv.appendChild(span);
            innerDiv.appendChild(button);
            adminBar.appendChild(innerDiv);


            const header = document.querySelector('header');
            header.style.marginTop = '100px';
            header.insertBefore(adminBar, header.firstChild);

            // ajouter le lien "modifier" qui ouvre la modale 
            const modifier = document.createElement('a');
            modifier.textContent = 'Modifier';
            modifier.href = "#modal";
            const h2Portfolio = document.querySelector('#portfolio h2');
            h2Portfolio.appendChild(modifier)

            //afficher la modale
            const modal = document.querySelector('.modal');
            modifier.addEventListener('click', function (e) {
                e.preventDefault();
                modal.style.display = null; // Set the display property to "block" to show the modal
            });
            //cacher la modale
            const closeModal = document.querySelector('.close-modal');
            closeModal.addEventListener('click', function (e) {
                e.preventDefault();
                modal.style.display = "none"; // Set the display property to "block" to show the modal
            });

            //retirer les filtres
            const filterBar = document.querySelector('.filter-bar');
            while (filterBar.firstChild) {
                filterBar.removeChild(filterBar.firstChild);
            }

        } else {
            logBtn.textContent = "Login";
        }
    }

    //login page
    if (currentUrl === "http://localhost:5678/login") {
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
                const userId = result.userId;
                const token = result.token;

                //stocker l'id et le token en local pour reseter identifié
                localStorage.setItem('userId', userId);
                localStorage.setItem('token', token);

                console.log("User:", result);

                if (userId === 1) {
                    window.location.href = '/';
                } else {
                    const sectionLogin = document.querySelector("#login-form");
                    const errorMsg = document.createElement("p");
                    errorMsg.textContent = "Identifiant ou mot de passe incorrecte";
                    sectionLogin.appendChild(errorMsg);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }
});