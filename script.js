async function loadFilms(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};


// BEST FILM
async function updateBestFilm() {
    endPoint = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    let bestFiveFilms = await loadFilms(endPoint);
    bestFilm = bestFiveFilms.results[0];

    document.getElementById("bestFilmTitle").innerText = bestFilm.title;
    document.getElementById("bestFilmTitle").parentElement.id = bestFilm.id;
    document.getElementById("bestFilmPicture").src = bestFilm.image_url;
    document.getElementById("bestFilmPicture").alt = bestFilm.title;
    bestFilmMoreData = await loadFilms(bestFilm.url);
    document.getElementById("bestFilmDesc").innerText = bestFilmMoreData.description;
}
updateBestFilm()
// --------------------------------------------------


// BEST FILMS PER CATEGORY
async function updateCategoryFilms(url, id, modalClassBtn, modalClassImg) {
    let fiveFilms = await loadFilms(url);

    const row = document.getElementById(id);
    row.innerHTML = '';

    if (fiveFilms.results.length == 0){
        const p = document.createElement('p')
        p.innerHTML = "Oups, désolé. Nous n'avons pas trouvé de résultats pour cette recherche. Veuillez sélectionner une autre catégorie."
        row.appendChild(p)
        row.nextElementSibling.children[0].classList.add("d-none") //Hide "Show More" Button
    } else {
        //Un-hide "Show More" Button if needed
        row.nextElementSibling.children[0].classList.remove("d-none") 

        // FIRST FIVE FILMS
        for (const film of fiveFilms.results) {
            const div = document.createElement('div');
            div.className = 'col-sm-12 col-md-6 col-lg-4 mb-4';
            div.innerHTML = `<div class="position-relative overflow-hidden" style="height: 350px;">
                                <img class="${modalClassImg} w-100 h-100 object-fit-cover" src=${film.image_url} alt=${film.title}>
                                <div class="position-absolute top-50 start-0 w-100 bg-dark d-flex flex-column p-2"
                                    style="--bs-bg-opacity: 0.6;" id=${film.id}>
                                    <strong class="text-light align-self-center text-center" style="font-size: x-large">${film.title}</strong>
                                    <button type="button" class="${modalClassBtn} btn btn-sm btn-dark align-self-end">Détails</button>
                                </div>
                            </div>`
            row.appendChild(div);
        }

        // SIXTH FILM
        if (fiveFilms.next !== null) {
            const followingFiveFilms = await loadFilms(fiveFilms.next);
            const sixthFilm = followingFiveFilms.results[0];

            const div = document.createElement('div');
                div.className = 'col-sm-12 col-md-6 col-lg-4 mb-4';
                div.innerHTML = `<div class="position-relative overflow-hidden" style="height: 350px;">
                                    <img class="${modalClassImg} w-100 h-100 object-fit-cover" src=${sixthFilm.image_url} alt=${sixthFilm.title}>
                                    <div class="position-absolute top-50 start-0 w-100 bg-dark d-flex flex-column p-2"
                                        style="--bs-bg-opacity: 0.7;" id=${sixthFilm.id}>
                                        <strong class="text-light align-self-center text-center" style="font-size: x-large">${sixthFilm.title}</strong>
                                        <button type="button" class="${modalClassBtn} btn btn-sm btn-dark align-self-end">Détails</button>
                                    </div>
                                </div>`
            row.appendChild(div);
        }

        const myFilms = Array.from(row.children)
        myFilms.forEach((film, index) => {
            if (index == 2 || index == 3){
                film.classList.add("d-none")
                film.classList.add("d-md-block")
            }

            if (index == 4 || index == 5) {
                film.classList.add("d-none")
                film.classList.add("d-lg-block")
            }
        })
    }
};
// --------------------------------------------------


// DROPDOWN MENU
function dropdownBtn() {
    document.getElementById("dropdown-menu").classList.toggle("show");
}
// --------------------------------------------------


// MODAL FUNCTION FOR SELECTABLE CATEGORY SECTION
function setModalInfos(bestFilm) {
    document.getElementById("modalTitle").innerText = bestFilm.title;
    document.getElementById("modalFirstLine").innerText = `${bestFilm.year} - ${bestFilm.genres.join(', ')}`;
    if (bestFilm.rated == "Not rated or unkown rating"){
        document.getElementById("modalSecondLine").innerText = `${bestFilm.rated} - ${bestFilm.duration}\xa0minutes (${bestFilm.countries.join('/')})`;
    } else {
        document.getElementById("modalSecondLine").innerText = `PG-${bestFilm.rated} - ${bestFilm.duration}\xa0minutes (${bestFilm.countries.join('/')})`;
    }
    document.getElementById("modalThirdLine").innerText = `IMDB score: ${bestFilm.imdb_score}/10`;
    if (bestFilm.worldwide_gross_income != null){
        document.getElementById("modalFourthLine").innerText = `Recette au box office mondial : ${bestFilm.worldwide_gross_income.toLocaleString()}$`;
    }
    document.getElementById("modalDirectors").innerText = `${bestFilm.directors.join(', ')}`;
    pictures = document.getElementsByClassName("modalPicture")
    for (picture of pictures){
        picture.src =  bestFilm.image_url;
        picture.alt = bestFilm.title;
    }
    document.getElementById("modalDescription").innerText = bestFilm.long_description;
    document.getElementById("modalActors").innerText = `${bestFilm.actors.join(', ')}`;
    document.getElementById("modal").style.display = "block";
}

function modalWindow() {
    const detailsButtons = document.getElementsByClassName("modalSelectableDetailsButton")
    for (button of detailsButtons){
        button.addEventListener("click", async function() {
            let bestFilm = await loadFilms(`http://localhost:8000/api/v1/titles/${this.parentElement.id}`);
            setModalInfos(bestFilm)
        })
    }

    const detailsImages = document.getElementsByClassName("modalSelectableDetailsImage")
    for (image of detailsImages){
        image.addEventListener("click", async function() {
            let bestFilm = await loadFilms(`http://localhost:8000/api/v1/titles/${this.nextElementSibling.id}`);
            setModalInfos(bestFilm)
        })
    }
}
// --------------------------------------------------

// SHOW MORE/SHOW LESS FUNCTION
function toggleFilms(id) {
    let toggle = document.getElementById(id).parentElement;
    toggle.onclick = function () {
        if (toggle.id == "unopenedToggle"){
            const myFilms = Array.from(toggle.previousElementSibling.children)
            myFilms.forEach((film, index) => {
                if (index == 2 || index == 3){
                    film.classList.remove("d-none")
                    film.classList.remove("d-md-block")
                }
        
                if (index == 4 || index == 5) {
                    film.classList.remove("d-none")
                    film.classList.remove("d-lg-block")
                }
            })
            toggle.id = "openedToggle"
            toggle.children[0].innerHTML = "Voir moins"
        } else if (toggle.id == "openedToggle") {
            const myFilms = Array.from(toggle.previousElementSibling.children)
            myFilms.forEach((film, index) => {
                if (index == 2 || index == 3){
                    film.classList.add("d-none")
                    film.classList.add("d-md-block")
                }
        
                if (index == 4 || index == 5) {
                    film.classList.add("d-none")
                    film.classList.add("d-lg-block")
                }
            })
            toggle.children[0].innerHTML = "Voir plus"
            toggle.id = "unopenedToggle"
        }
    }
}
// --------------------------------------------------


// FUNCTIONS TO LAUNCH ONCE DOCUMENT IS LOADED
document.addEventListener("DOMContentLoaded", async function() 
{
    // Generate all category films sections
    const bestFilmsUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    await updateCategoryFilms(bestFilmsUrl, 'bestMoviesRow', 'modalDetailsButton', 'modalDetailsImage');

    const categoryUrl = "http://localhost:8000/api/v1/titles/?genre=crime&sort_by=-imdb_score";
    await updateCategoryFilms(categoryUrl, 'firstCategoryRow', 'modalDetailsButton', 'modalDetailsImage')

    const secondCategoryUrl = "http://localhost:8000/api/v1/titles/?genre=comedy&sort_by=-imdb_score";
    await updateCategoryFilms(secondCategoryUrl, 'secondCategoryRow', 'modalDetailsButton', 'modalDetailsImage')

    // Close button on modal
    const closeModalBtn = document.getElementById("close-modal");
    closeModalBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Change films when dropdown item is clicked
    const categories = document.getElementsByClassName("dropdown-item")
    for (category of categories){
        category.addEventListener("click", async function() {
            document.getElementById("category-button").innerHTML = this.innerHTML;
            const selectableCategoryRow = `http://localhost:8000/api/v1/titles/?genre=${this.innerHTML}&sort_by=-imdb_score`
            await updateCategoryFilms(selectableCategoryRow, 'selectableCategoryRow', 'modalSelectableDetailsButton', 'modalSelectableDetailsImage')
            modalWindow()
        })
    }
    document.getElementById("dropdown-default").click()

    // Generate event listener on details button except last section (modal window)
    const detailsButtons = document.getElementsByClassName("modalDetailsButton")
    for (button of detailsButtons){
        button.addEventListener("click", async function() {
            let bestFilm = await loadFilms(`http://localhost:8000/api/v1/titles/${this.parentElement.id}`);
            setModalInfos(bestFilm)
        })
    }

    // Generate event listener on image of best film (modal window)
    const detailsImagesBestFilm = document.getElementsByClassName("modalDetailsImageBestFilm")
    detailsImagesBestFilm[0].addEventListener("click", async function() {
        let bestFilm = await loadFilms(`http://localhost:8000/api/v1/titles/${this.parentElement.nextElementSibling.id}`);
        setModalInfos(bestFilm)
    })

    // Generate event listener on images for each section except last one (modal window)
    const detailsImages = document.getElementsByClassName("modalDetailsImage")
    for (image of detailsImages){
        image.addEventListener("click", async function() {
            let bestFilm = await loadFilms(`http://localhost:8000/api/v1/titles/${this.nextElementSibling.id}`);
            setModalInfos(bestFilm)
        })
    }

    toggleFilms("toggleBestFilms")
    toggleFilms("toggleFirstCategoryFilms")
    toggleFilms("toggleSecondCategoryFilms")
    toggleFilms("toggleSelectableCategoryFilms")

})
// --------------------------------------------------

