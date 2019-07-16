const tagsParseInitSel = (tagGi, tags, tagsMap) => {
  const ct = tags[tagGi];
 
  const gisIndetTrue = [];
  const gisSelTrue = [tagGi];
  /** handling self and descendants */
  if (ct.typeNode === true) {
    gisSelTrue.push(...tagsMap.get(tagGi).descendantsAll);
  }
  /** handling ancestors chain if any */
  if (ct.parent) {
    /** getting the list of ancestors and pushing them to the array to set intermediate to true
     */
    gisIndetTrue.push(...tagsMap.get(tagGi).ancestors);
  }
  
  /** setting selected to true for self and descendants */
  for (const gi of gisSelTrue) {
    tags[gi].selected = true;
  }
  /** setting indeterminate to true for ancestors */
  for (const gi of gisIndetTrue) {
    tags[gi].indeterminate = true;
  }
};

export default tagsParseInitSel;
