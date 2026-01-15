const remove = (recipe, ingredient) => {
    const index = recipe.indexOf(ingredient);
    if (index === -1) return recipe;
    return [...recipe.slice(0, index), ...recipe.slice(index + 1)];
} 
export default remove;
