const find = (recipe, substring) => {
  return recipe.filter(v =>
    v.toLowerCase().includes(substring.toLowerCase())
  );
};

export default find;
