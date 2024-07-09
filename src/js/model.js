import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helper';

export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        resultPerPage: RES_PER_PAGE,
        page: 1,
    },

    bookmarks: [],
};

const createRecipe = function (recipe) {
    // console.log({
    //     id: recipe.id,
    //     title: recipe.title,
    //     publisher: recipe.publisher,
    //     sourceUrl: recipe.source_url,
    //     image: recipe.image_url,
    //     servings: recipe.servings,
    //     cookingTime: recipe.cooking_time,
    //     ingredients: recipe.ingredients,
    //     ...(recipe.key && {key:recipe.key})
    // });
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key:recipe.key})
    };
};

export const loadRecipe = async function (recipeId) {
    try {
        const { recipe } = await AJAX(`${API_URL}/${recipeId}/?key=${API_KEY}`);
        state.recipe = createRecipe(recipe);

        if (state.bookmarks.some(bookmark => bookmark.id === recipeId))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const loadSearchResult = async function (query) {
    try {
        state.search.query = query;
        const { recipes } = await AJAX(
            `${API_URL}?search=${query}&key=${API_KEY}`
        );
        state.search.result = recipes.map(result => {
            return {
                id: result.id,
                title: result.title,
                publisher: result.publisher,
                image: result.image_url,
                ...(result.key && {key:result.key})
            };
        });
    } catch (error) {
        throw error;
    }
};

export const getSearchResultPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultPerPage;
    const end = page * state.search.resultPerPage;
    return state.search.result.slice(start, end);
};

export const updateServings = function (newServ) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServ) / state.recipe.servings;
    });

    state.recipe.servings = newServ;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    console.log(index);
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) {
        state.bookmarks = JSON.parse(storage);
    }
};

init();

export const uploadRecipe = async function (newRecipe) {
    try {
        const newIngredients = Object.entries(newRecipe)
            .filter(entry => {
                return entry[0].startsWith('ingredient') && entry[1] !== '';
            })
            .map(ing => {
                const ingArr = ing[1].replaceAll(' ', '').split(',');
                if (ingArr.length !== 3) throw new Error('Wrong Ingredient');

                const [quantity, unit, description] = ingArr;
                return { quantity, unit, description };
            });
        newRecipe.ingredients = newIngredients;
        console.log(newIngredients);
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients: newRecipe.ingredients,
        };

        const data = await AJAX(`${API_URL}/?key=${API_KEY}`, recipe);
        state.recipe = createRecipe(data.data.recipe);
        // console.log(data);
        addBookmark(state.recipe)
    } catch (error) {
        throw error;
    }
};
