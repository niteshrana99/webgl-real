// 44aab0b89736d478c7309f593a5c1968
// https://www.food2fork.com/api/search
import Search from './model/Search';
import {elements} from './views/base';
import * as searchView from './views/searchView';
/*
Global state of app:
--Search object.
--current recipe object.
--Shopping list object.
--liked recipes.
*/
const state = {};

const controlSearch = async () => {
    //1. Get query from view
    const query = searchView.getInput();
    console.log(query);
    if(query) {
        //new search object.
        //add to state object
        state.search = new Search(query);

        //prepare UI.
        searchView.clearInput();
        searchView.clearResults();
        //Search for recipes
        await state.search.getResults();

        //render results on UI
        searchView.renderResults(state.search.recipes);
        console.log(state.search.recipes)
    }
}

elements.searchForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    controlSearch();
})