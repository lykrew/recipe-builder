const sortRecipe = (recipe, direction) => {
    const result = [...recipe];

    result.sort((a, b) => {
        if (a === b) return 0;

        if (direction === 'desc') {
            return a < b ? 1 : -1;
        }
        return a > b ? 1 : -1;
    });
    return result;
};

export default sortRecipe;
