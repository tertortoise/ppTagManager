/** returns a map with gi values:
 *    - parent
 *    - ancestors
 *    - descendantsAll
 *    - descendantsAllNodes
 *    - descendantsDir
 *    - descendantsDirNodes
 * modifies array (delets parentGI, childrenGI)
 */
const tagsParseMap = array => {
  const map = new Map();
  /** adding parent, descendantsDir, descendantsDirNodes */
  for (let i = 0; i < array.length; i++) {
    const attributes = {};

    if (array[i].hasOwnProperty('parentGi')) {
      let parent = array[i].parentGi;
      attributes.parent = parent;
      attributes.ancestors = [].concat(parent);
      while (array[parent].hasOwnProperty('parentGi')) {
        attributes.ancestors.push(array[parent].parentGi);
        parent = array[parent].parentGi;
      }
    }

    /** descendants loop */
    attributes.descendantsAll = [];
    attributes.descendantsDir = [];
    attributes.descendantsAllNodes = [];
    attributes.descendantsDirNodes = [];
    for (let j = i + 1; j < array.length; j++) {
      if (array[j].level <= array[i].level) {
        break;
      } else if (
        array[j].level === array[i].level + 1 &&
        array[j].hasOwnProperty('expanded')
      ) {
        attributes.descendantsDir.push(array[j].gi);
        attributes.descendantsDirNodes.push(array[j].gi);
        attributes.descendantsAll.push(array[j].gi);
        attributes.descendantsAllNodes.push(array[j].gi);
      } else if (array[j].level === array[i].level + 1) {
        attributes.descendantsDir.push(array[j].gi);
        attributes.descendantsAll.push(array[j].gi);
      } else if (
        array[j].level > array[i].level + 1 &&
        array[j].hasOwnProperty('expanded')
      ) {
        attributes.descendantsAll.push(array[j].gi);
        attributes.descendantsAllNodes.push(array[j].gi);
      } else if (array[j].level > array[i].level + 1) {
        attributes.descendantsAll.push(array[j].gi);
      }
    }

    map.set(array[i].gi, attributes);
  }
  /** good blow on performance? almost doubles the time to perform */
  for (let i = 0; i < array.length; i++) {
    delete array[i].parentGi;
    delete array[i].childrenGi;
  }
  return map;
};

module.exports = tagsParseMap;
