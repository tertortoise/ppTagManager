const sortArrayObj = (field, order = 'asc') => {
  return function(a, b) {
    if (!a.hasOwnProperty(field) || !b.hasOwnProperty(field)) {
      // property doesn't exist on either object
      return 0;
    }
    const varA =
      typeof a[field] === 'string' ? a[field].toUpperCase() : a[field];
    const varB =
      typeof b[field] === 'string' ? b[field].toUpperCase() : b[field];
    let comparison = 0;
    if (varA > varB) comparison = 1;
    else if (varA < varB) comparison = -1;
    return order === 'desc' ? comparison * -1 : comparison;
  };
};

const tagsParseSort = data => {
  /**Defining recursion to work from level1 */


  const tagsParseSortRec = (array, currentLevel, level = 1) => {
    currentLevel.forEach(tagCL => {
      let nextLevelChildren = array.filter(tagNL => {
        return +tagNL.level === +level + 1 && tagCL._id === tagNL.parent;
      });
      if (nextLevelChildren.length === 0) {
        sorted.push(tagCL);
      } else {
        sorted.push(tagCL);
        tagsParseSortRec(array, nextLevelChildren, level + 1);
      }
    });
  };
  /** Initializing level1 */
  const sorted = [];
  data.sort(sortArrayObj('name'));
  const arrayRoot = data.filter(tag => tag.level === 1);
  const arrayNonRoot = data.filter(tag => tag.level !== 1);
  tagsParseSortRec(arrayNonRoot, arrayRoot);
  if (sorted.length === data.length) return sorted;
  else {
    throw new Error('Initial tags sorting did not go well! Check algorithm or data integrity!');
  }
};

export default tagsParseSort;