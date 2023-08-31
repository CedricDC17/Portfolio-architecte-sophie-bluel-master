document.addEventListener('DOMContentLoaded', function () {

    let works; // Declare works globally
    let filtreObjets = [];
    let filtreApt = [];
    let filtreHR = [];
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
        console.log(filtreObjets);
        console.log(filtreApt);
        console.log(filtreHR);
        
        const boutonFiltreObjets = document.getElementById('objets')
        const boutonFiltreApt = document.getElementById('appartements')
        const boutonFiltreHR = document.getElementById('hotels-restaurants')
        const boutonTous = document.getElementById('travaux')
        const sectionGallery = document.querySelector(".gallery");

        //afficher tous les travaux
        works.forEach(work => {
            const figureElement = document.createElement("figure");
            const imageElement = document.createElement("img");
            // imageElement.src = work.imageURL; // Assuming your work object has an imageURL property
            imageElement.src = "assets/images/abajour-tahina.png";
            const titleElement = document.createElement("figcaption");
            titleElement.textContent = work.title;

            sectionGallery.appendChild(figureElement);
            figureElement.appendChild(imageElement);
            figureElement.appendChild(titleElement);
        });

        //button qui supprime tous les travaux et les remplacent par une catégorie
        boutonFiltreObjets.addEventListener('click', function () {
            while (sectionGallery.firstChild) {
                sectionGallery.removeChild(sectionGallery.firstChild);
            }
            filtreObjets.forEach(work => {
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                // imageElement.src = work.imageURL; // Assuming your work object has an imageURL property
                imageElement.src = "assets/images/abajour-tahina.png";
                const titleElement = document.createElement("figcaption");
                titleElement.textContent = work.title;
    
                sectionGallery.appendChild(figureElement);
                figureElement.appendChild(imageElement);
                figureElement.appendChild(titleElement);
            });
        })
        boutonFiltreApt.addEventListener('click', function () {
            while (sectionGallery.firstChild) {
                sectionGallery.removeChild(sectionGallery.firstChild);
            }
            filtreApt.forEach(work => {
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                // imageElement.src = work.imageURL; // Assuming your work object has an imageURL property
                imageElement.src = "assets/images/abajour-tahina.png";
                const titleElement = document.createElement("figcaption");
                titleElement.textContent = work.title;
    
                sectionGallery.appendChild(figureElement);
                figureElement.appendChild(imageElement);
                figureElement.appendChild(titleElement);
            });
        })
        boutonFiltreHR.addEventListener('click', function () {
            while (sectionGallery.firstChild) {
                sectionGallery.removeChild(sectionGallery.firstChild);
            }
            filtreHR.forEach(work => {
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                // imageElement.src = work.imageURL; // Assuming your work object has an imageURL property
                imageElement.src = "assets/images/abajour-tahina.png";
                const titleElement = document.createElement("figcaption");
                titleElement.textContent = work.title;
    
                sectionGallery.appendChild(figureElement);
                figureElement.appendChild(imageElement);
                figureElement.appendChild(titleElement);
            });
        })
        boutonTous.addEventListener('click', function () {
            while (sectionGallery.firstChild) {
                sectionGallery.removeChild(sectionGallery.firstChild);
            }
            works.forEach(work => {
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                // imageElement.src = work.imageURL; // Assuming your work object has an imageURL property
                imageElement.src = "assets/images/abajour-tahina.png";
                const titleElement = document.createElement("figcaption");
                titleElement.textContent = work.title;
    
                sectionGallery.appendChild(figureElement);
                figureElement.appendChild(imageElement);
                figureElement.appendChild(titleElement);
            });
        })
    });
});


