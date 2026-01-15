const exists = (recipe, ingredient) => {
    for (let i = 0; i < recipe.length; i++) {
        if (recipe[i] === ingredient) return true;
    }
    return false;
}
export default exists;