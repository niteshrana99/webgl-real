import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        const key = '44aab0b89736d478c7309f593a5c1968';
        try {
            const results = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.recipes = results.data.recipes;
            // console.log(this.recipes);
        } catch(error) {
            console.log(error);
        }
        
    }
}