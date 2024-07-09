import * as modal from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
// we can import all kinds of files and assets in js

import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if(module.hot){
//     module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipies = async function () {
    try {
        // we can fetch api data based on a specific recipe id.
        const recipeId = window.location.hash.slice(1);
        if (!recipeId) return;

        recipeView.renderSpinner();

        resultView.update(modal.getSearchResultPage());
        bookmarksView.update(modal.state.bookmarks);
        await modal.loadRecipe(recipeId);

        const { recipe } = modal.state;
        recipeView.render(recipe);
    } catch (err) {
        recipeView.renderError(`${err} boom!boom!`);
    }
};

const controlSearch = async function () {
    try {
        const query = searchView.getQuery();
        if (!query) return;
        modal.state.search.page = 1;
        resultView.renderSpinner();
        await modal.loadSearchResult(query);

        resultView.render(modal.getSearchResultPage(modal.state.search.page));
        paginationView.render(modal.state.search);
    } catch (error) {
        console.log(error);
    }
};

const controlPagination = function (gotoPage) {
    // console.log(modal.getSearchResultPage(+gotoPage));
    // console.log(gotoPage);
    resultView.render(modal.getSearchResultPage(gotoPage));
    paginationView.render(modal.state.search);
};

const controlServings = function (newServ) {
    modal.updateServings(newServ);

    recipeView.update(modal.state.recipe);
};

const controlBookmark = function () {
    if (!modal.state.recipe.bookmarked) {
        modal.addBookmark(modal.state.recipe);
    } else {
        modal.deleteBookmark(modal.state.recipe.id);
    }
    recipeView.update(modal.state.recipe);

    bookmarksView.render(modal.state.bookmarks);
};

const controlLoadBookmarks = function () {
    bookmarksView.render(modal.state.bookmarks);
};

async function uploadRecipe(newRecipe) {
    try {
        addRecipeView.renderSpinner();
        await modal.uploadRecipe(newRecipe);
        recipeView.render(modal.state.recipe);
        addRecipeView.renderMessage();
        bookmarksView.render(modal.state.bookmarks);

        window.history.pushState(null, '', `#${modal.state.recipe.id}`);

        setTimeout(() => {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SECONDS * 1000);
    } catch (error) {
        console.log(error);
        addRecipeView.renderError(error.message);
    }
}

function init() {
    bookmarksView.addHandlerRender(controlLoadBookmarks);
    recipeView.addHandlerRender(controlRecipies);
    searchView.addHandlerSearch(controlSearch);
    paginationView.addHandlerPagination(controlPagination);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerBookmark(controlBookmark);
    addRecipeView.addHandlerUpload(uploadRecipe);
}

init();
