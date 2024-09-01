async function loadFilms(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

// BEST FILM
async function updateBestFilm() {
    endPoint = "http://localhost:8000/api/v1/titles/?lang_contains=fr&sort_by=-imdb_score";
    let bestFiveFilms = await loadFilms(endPoint);
    bestFilm = bestFiveFilms.results[0];

    // BEST FILM
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
async function updateCategoryFilms(url, id) {
    let fiveFilms = await loadFilms(url);

    // FIRST FIVE FILMS
    const row = document.getElementById(id);
    row.innerHTML = '';
    for (const film of fiveFilms.results) {
        const div = document.createElement('div');
        div.className = 'col-sm-12 col-md-6 col-lg-4 mb-4';
        div.innerHTML = `<div class="position-relative overflow-hidden" style="height: 350px;">
                            <img class="w-100 h-100 object-fit-cover" src=${film.image_url} alt=${film.title}>
                            <div class="position-absolute top-50 start-0 w-100 bg-dark d-flex flex-column p-2"
                                style="--bs-bg-opacity: 0.6;">
                                <strong class="text-light align-self-center text-center" style="font-size: x-large">${film.title}</strong>
                                <button type="button" id="detailsBtn" class="btn btn-sm btn-dark align-self-end">Détails</button>
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
                                <img class="w-100 h-100 object-fit-cover" src=${sixthFilm.image_url} alt=${sixthFilm.title}>
                                <div class="position-absolute top-50 start-0 w-100 bg-dark d-flex flex-column p-2"
                                    style="--bs-bg-opacity: 0.7;">
                                    <strong class="text-light align-self-center text-center" style="font-size: x-large">${sixthFilm.title}</strong>
                                    <button type="button" id="detailsBtn" class="btn btn-sm btn-dark align-self-end">Détails</button>
                                </div>
                            </div>`
        row.appendChild(div);
    }
    
};

const bestFilmsUrl = "http://localhost:8000/api/v1/titles/?lang_contains=fr&sort_by=-imdb_score";
updateCategoryFilms(bestFilmsUrl, 'bestMoviesRow');

const categoryUrl = "http://localhost:8000/api/v1/titles/?genre=crime&lang_contains=fr&sort_by=-imdb_score";
updateCategoryFilms(categoryUrl, 'firstCategoryRow')

const secondCategoryUrl = "http://localhost:8000/api/v1/titles/?genre=comedy&lang_contains=fr&sort_by=-imdb_score";
updateCategoryFilms(secondCategoryUrl, 'secondCategoryRow')
// --------------------------------------------------

// DROPDOWN MENU
function dropdownBtn() {
    document.getElementById("dropdown-menu").classList.toggle("show");
}

window.onload = function dropdownClicked() {
    const categories = document.getElementsByClassName("dropdown-item")
    for (category of categories){
        category.addEventListener("click", function() {
            document.getElementById("category-button").innerHTML = this.innerHTML;
            const selectableCategoryRow = `http://localhost:8000/api/v1/titles/?genre=${this.innerHTML}&lang_contains=fr&sort_by=-imdb_score`
            updateCategoryFilms(selectableCategoryRow, 'selectableCategoryRow')
        })
    }
    document.getElementById("dropdown-default").click()
}
// --------------------------------------------------



// MODAL WINDOWS
document.addEventListener("DOMContentLoaded", function() 
{
	const openModalBtn = document.getElementById("detailsBtn");
    const modal = document.getElementById("modal");
    const closeModalBtn = document.getElementById("close-modal");

    openModalBtn.onclick = async function() {
        modal.style.display = "block";
    }

    closeModalBtn.onclick = function() {
        modal.style.display = "none";
    } 
})
// --------------------------------------------------

