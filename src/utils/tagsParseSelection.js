/** Parses array of tags to determing what to show in Selection Box
 * It is different from the tags that should go to the database
 */
const tagsParseSelection = a => {
  /** initializing current level of selection CLOS to a big number and result to empty array */
  const result = [];
  let CLOS = 1000;
  for (let i = 0; i < a.length; i++) {
    if (a[i].selected && a[i].level <= CLOS) {
      result.push(a[i]);
      CLOS = a[i].level;
    } else if (a[i].selected && a[i].level > CLOS) {
      continue;
    } else if (!a[i].selected && a[i].level <= CLOS) {
      CLOS = 1000;
    }
  }
  return result;
};

export default tagsParseSelection;
