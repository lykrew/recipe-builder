const list = (recipe) =>{
    let result = '';
    for (let i = 0; i < recipe.length; i++) {
        result += `${i + 1}. ${recipe[i]}`;
        if (i < recipe.length - 1) {
            result += '\n';
        }
    }
    return result;
}
export default list;
