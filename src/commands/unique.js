const unique = (recipe) => {
    const result = [];
    for (let i = 0; i < recipe.length; i++) {
        if (!result.includes(recipe[i])) result.push(recipe[i]);
    }
    return result;
};

export default unique;

