const merge = (recipe, csvList) => {
    const result = [...recipe];
    const items = csvList.split(',');

    for (let i = 0; i < items.length; i++) {
        result.push(items[i].trim());
    }
    return result;
};

export default merge;