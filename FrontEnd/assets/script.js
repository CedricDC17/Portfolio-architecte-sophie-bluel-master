document.addEventListener('DOMContentLoaded', async function () {
    //déclaration des variables globales
    let works;
    const userID = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token');

    console.log(userID);
    console.log(token);

    //récupère les boutons du html
    //récupère la div classe gallery
    //récupere la modale 
    //récup le lien du bouton login/logout
    //récup les modales
    const logBtn = document.getElementById('log');
    const boutonFiltreObjets = document.getElementById('objets')
    const boutonFiltreApt = document.getElementById('appartements')
    const boutonFiltreHR = document.getElementById('hotels-restaurants')
    const boutonTous = document.getElementById('travaux')
    const sectionGallery = document.querySelector(".gallery");
    const modalGallery = document.getElementById('modal-gallery');
    const modal2 = document.querySelector('#modal2')
    const modal = document.querySelector('#modal')
    const photoPreview = document.getElementById('photoPreview');        
    const newFileTxt = document.querySelector('.new-file-text')

    //met tous les travaux dans works
    works = await logWorks();

    //création de listes de travaux triées par catégories
    const filtreObjets = works.filter(work => {
        return work.categoryId === 1;
    });
    const filtreApt = works.filter(work => {
        return work.categoryId === 2;
    });
    const filtreHR = works.filter(work => {
        return work.categoryId === 3;
    });

    //ajout des filtres aux boutons
    activerBouton(boutonTous);
    if (!userID) {    //pour ne pas avoir d'erreur dans la console en amdin
        boutonFiltreObjets.addEventListener('click', function () {
            activerBouton(boutonFiltreObjets);
            affichageTravaux(filtreObjets);
        });
        
        boutonFiltreApt.addEventListener('click', function () {
            activerBouton(boutonFiltreApt);
            affichageTravaux(filtreApt);
        });
        
        boutonFiltreHR.addEventListener('click', function () {
            activerBouton(boutonFiltreHR);
            affichageTravaux(filtreHR);
        });
        
        boutonTous.addEventListener('click', function () {
            activerBouton(boutonTous);
            affichageTravaux(works);
        });
    }
    else {    //chargement de la page et toutes les fonctions du mode admin
        adminMod();
    }

    affichageTravaux(works);

    affichageTravauxModale();

    loadPreview();

    modalForm();

    smoothScroll();

    async function logWorks() { //fonction qui envoie une requete à l'api pour récuprer tous les travaux

        let response = await fetch('http://localhost:5678/api/works');
        let worksData = await response.json();
        return worksData;
    }

    function affichageTravaux(list) { //suppr tous les travaux et affichent ceux du filtre en paramètre
        sectionGallery.innerHTML = "";
        list.forEach(work => {
            const figureElement = document.createElement("figure");
            figureElement.classList.add('work' + work.id)
            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            const titleElement = document.createElement("figcaption");
            titleElement.textContent = work.title;

            sectionGallery.appendChild(figureElement);
            figureElement.appendChild(imageElement);
            figureElement.appendChild(titleElement);
        });
    }

    function affichageTravauxModale() { //afficher les travaux dans la modale cachée
        works.forEach(function (work) {
            const figureElement = document.createElement("figure");
            figureElement.id = work.id
            const imageElement = document.createElement("img");
            imageElement.classList.add('modal-img')
            imageElement.src = work.imageUrl;
            const iconDiv = document.createElement("div");
            iconDiv.classList.add('trash');
            const iconElement = document.createElement("i");
            iconElement.classList.add('fa-solid', 'fa-trash');

            iconDiv.addEventListener('click', function (e) {
                e.preventDefault();
                let apiUrl = "http://localhost:5678/api/works/"
                apiUrl += work.id;
                console.log(apiUrl)
                fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('La suppression a réussi.');
                            const removedWork = document.querySelector('.work' + work.id)

                            while (figureElement.firstChild || removedWork.firstChild) {
                                if (figureElement.firstChild) {
                                    figureElement.removeChild(figureElement.firstChild);
                                }

                                if (removedWork.firstChild) {
                                    removedWork.removeChild(removedWork.firstChild);
                                }
                            }
                            figureElement.remove();
                            removedWork.remove();
                        } else {
                            console.error('Erreur lors de la suppression.');
                        }
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                    });
            });

            figureElement.appendChild(iconDiv);
            iconDiv.appendChild(iconElement);
            modalGallery.appendChild(figureElement);
            figureElement.appendChild(imageElement);
        })
    }

    function smoothScroll() { //smooth scroll
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
    }

    function logout() { //si admin, logout supprime le token admin et recharge la page 
        logBtn.addEventListener('click', function () {
            if (userID === "1") {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                logBtn.href = "/";
            }
        })
    }

    function modalForm() { // récuperer les données du formulaire de modal2
        const form = document.querySelector('.new-photo-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const { files } = document.getElementById('photoInput');
            const titreInput = document.getElementById('titre').value;
            const categorie = document.getElementById('categorie').value;

            const formData = new FormData();



            formData.append('image', files[0]);
            formData.append('title', titreInput);
            formData.append('category', categorie);


            const imageError = document.getElementById('imageError');
            if (files.length === 0 || files[0].size === 0) {
                imageError.style.display = 'block';
                return;
            }
            else {
                const response = await fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.id && data.imageUrl) {
                        modal2.style.display = "none";
                        modal.style.display = null;
                        form.reset();
                        photoPreview.style.display = 'none'
                        newFileTxt.style.display= null
                        afficherNouveauTravailModale(data);
                        afficherNouveauTravailAcceuil(data);
                    }
                }
            }
        });
    }

    function loadPreview() { //charger la preview de la photo dans modale2
        const photoInput = document.getElementById('photoInput');
        const addPhotoButton = document.getElementById('addPhotoButton');

        //déclenche un clic sur photoInputquand l'image ou le bouton est click
        addPhotoButton.addEventListener('click', function () {
            photoInput.click();
        });

        photoPreview.addEventListener('click', function () {
            photoInput.click();
        });

        //photo preview
        photoInput.addEventListener('change', function () {
            const file = photoInput.files[0]; //récupère le premier fichier sélectionné par l'utilisateur

            if (file) {
                const reader = new FileReader(); //permet de lire le contenu du fichier sélectionné 
                reader.onload = function (e) { //appelé lorsque le fichier sera lu avec succès
                    photoPreview.src = e.target.result;
                    photoPreview.style.display = null; //afficher la photo
                    newFileTxt.style.display = "none"; //retirer le text de l'input
                };
                reader.readAsDataURL(file); //charger le fichier 
            }
        });
    }

    function afficherNouveauTravailModale(e) { //afficher dans la modale
        const figureElement = document.createElement("figure");
        figureElement.id = e.id;
        const imageElement = document.createElement("img");
        imageElement.classList.add('modal-img');
        imageElement.src = e.imageUrl;
        const iconDiv = document.createElement("div");
        iconDiv.classList.add('trash');
        const iconElement = document.createElement("i");
        iconElement.classList.add('fa-solid', 'fa-trash');
        iconDiv.appendChild(iconElement);

        iconDiv.addEventListener('click', async function (event) {
            event.preventDefault();
            const apiUrl = `http://localhost:5678/api/works/${e.id}`;

            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                console.log('La suppression a réussi.');
                const removedWork = document.querySelector('.work' + e.id);

                while (figureElement.firstChild) {
                    figureElement.firstChild.remove();
                }

                while (removedWork.firstChild) {
                    removedWork.firstChild.remove();
                }

                figureElement.remove();
                removedWork.remove();
            } else {
                console.error('Erreur lors de la suppression.');
            }
        });

        figureElement.appendChild(iconDiv);
        figureElement.appendChild(imageElement);
        modalGallery.appendChild(figureElement);
    }

    function afficherNouveauTravailAcceuil(e) { //afficher sur la page d'acceuil
        const figureElement = document.createElement("figure");
        figureElement.classList.add('work' + e.id)
        const imageElement = document.createElement("img");
        imageElement.src = e.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.textContent = e.title;

        sectionGallery.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(titleElement);
    }

    function activerBouton(bouton) {
        // Désactivez tous les boutons
        boutonFiltreObjets.classList.remove('actif');
        boutonFiltreApt.classList.remove('actif');
        boutonFiltreHR.classList.remove('actif');
        boutonTous.classList.remove('actif');
    
        // Activez le bouton spécifié
        bouton.classList.add('actif');
    }

    function adminMod() {
        logout();
        createAdminBar();
        removeFilters();
        addEditLink();
        closeModal();
        openModal2();
    }

    function createAdminBar() { //afficher la barre d'administration
        logBtn.textContent = "logout";
        const adminBar = document.createElement('div');
        adminBar.classList.add('admin-bar');
        const innerDiv = document.createElement('div');
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-pen-to-square');
        const span = document.createElement('span');
        span.textContent = 'Mode édition';
        const button = document.createElement('button');
        button.textContent = 'Publier les changements';
        button.addEventListener('click', function () {
            location.reload();
        });

        // Affichage de la barre d'administration
        innerDiv.appendChild(icon);
        innerDiv.appendChild(span);
        innerDiv.appendChild(button);
        adminBar.appendChild(innerDiv);

        const header = document.querySelector('header');
        header.style.marginTop = '100px';
        header.insertBefore(adminBar, header.firstChild);
    }

    function addEditLink() { //ajouter le lien "Modifier" qui ouvre la modale
        const h2Portfolio = document.querySelector('#portfolio h2');
        const modifier = document.createElement('a');
        modifier.href = "#modal";
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-pen-to-square');
        modifier.appendChild(icon);
        modifier.appendChild(document.createTextNode(' Modifier'));

        h2Portfolio.appendChild(modifier);

        modifier.addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = null;
        });
    }

    function closeModal() { //cacher les modales
        const closeModals = document.querySelectorAll('.close-modal');

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = "none";
                modal2.style.display = "none";
            }
        });

        modal2.addEventListener('click', function (e) {
            if (e.target === modal2) {
                modal.style.display = "none";
                modal2.style.display = "none";
            }
        });

        closeModals.forEach(function (closeModal) {
            closeModal.addEventListener('click', function (e) {
                e.preventDefault();
                modal.style.display = "none";
                modal2.style.display = "none";
            });
        });



        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = null;
            modal2.style.display = "none";
        });
    }

    function removeFilters() { //retirer les filtres
        const filterBar = document.querySelector('.filter-bar');
        filterBar.innerHTML = ''
    }

    function openModal2() { //ouverture de la modale2
        const newPhotoBtn = document.querySelector('.new-photo')
        newPhotoBtn.addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = "none";
            modal2.style.display = null;
        });
    }
    
});