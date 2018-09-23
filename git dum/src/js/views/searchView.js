import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () =>{
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
}

const limitRecipeTitle = (title, limit = 17) => {
    let newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if(acc+curr.length <= limit) {
                newTitle.push(curr);
            }
        }, 0)
    }
    return title;
} 

const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="img">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${recipe.title}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend',markup);
}

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
}