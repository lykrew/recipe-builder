const replace = (recipe, oldVal, newVal) => {
    const index = recipe.indexOf(oldVal);
    if (index === -1) return [...recipe];
    
    const result = [...recipe];
    result[index] = newVal;
    return result;
}

export default replace;
