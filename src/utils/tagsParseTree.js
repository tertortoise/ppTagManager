const parseTagsTree = (array, initSelection, mode) => {
  /** Assigning gi to each tag */
  array.forEach((tag, index) => {
    tag.gi = index;
  });

  let initSelectionGis = [];

  const mapId = new Map();
  /** aux initializing of maps to reduce big O of parsing
   * and forming array of selected tags gis for input array of selected tags ids
   */
  for (const tag of array) {
    mapId.set(tag._id, tag);
    if (initSelection.length > 0) {
      for (const initSelectionId of initSelection) {
        if (tag._id === initSelectionId) initSelectionGis.push(tag.gi);
      }
    }
  }

  for (let i = 0; i < array.length; i++) {
    /** adding:
     *  parentGI, childrenGI for easy reference
     * expanded is false for those having childred
     * counterDDS for direct descendants selected counter
     */
    if (array[i].parent !== null) {
      array[i].parentGi = mapId.get(array[i].parent).gi;
      if (!array[array[i].parentGi].childrenGi) {
        array[array[i].parentGi].childrenGi = [array[i].gi];
        array[array[i].parentGi].expanded = false;

        array[array[i].parentGi].typeNode = true;
      } else {
        array[array[i].parentGi].childrenGi.push(array[i].gi);
      }
    }
    /** adding visibility, expansion and selection booleans:
     * visibility depends on mode
     * selected - all false
     * indeterminate
     */

    if (array[i].level === 1) {
      array[i].visible = true;
    } else array[i].visible = false;

    array[i].selected = false;
    array[i].indeterminate = false;
  }
  return initSelectionGis;
};

export default parseTagsTree;
