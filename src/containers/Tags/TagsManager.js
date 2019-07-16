import React, { Component } from 'react';

import axiosInstance from '../../axios';
import TagsTree from './TagsTree';
import TagsSelection from '../../components/Tags/TagsSelection';
import tagsParseSort from '../../utils/tagsParseSort';
import tagsParseTree from '../../utils/tagsParseTree';
import tagsParseMap from '../../utils/tagsParseMap';
import tagsParseSelection from '../../utils/tagsParseSelection';
import tagsParseInitSel from '../../utils/tagsParseInitSel';
import classes from './TagsManager.module.scss';

class TagsManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      treeExpanded: true,
      tagsShouldBeUpdated: false,
    };
  }

  componentDidMount() {

    //mode tagsEditor
    axiosInstance
      .get('/api/tagsAll')
      .then((response) => {
        let tags = tagsParseSort(response.data);
        let initSelTagsIds = [];

        if (this.props.initSelTagsIds[0] === '_all') {
          tags.forEach((tag) => {
            if (tag.level === 1) initSelTagsIds.push(tag._id);
          });
        } else initSelTagsIds = this.props.initSelTagsIds;
        const initSelTagsGis = tagsParseTree(tags, initSelTagsIds, this.props.mode);
        const tagsMap = tagsParseMap(tags);
        for (const tagGi of initSelTagsGis) {
          tagsParseInitSel(tagGi, tags, tagsMap);
        }
        this.setState({ tags, tagsMap });
      })
      .catch((e) => {
        console.log('TAGSMANAGER: Error loading tags');
      });
  }

  componentDidUpdate() {
    
    if (this.props.tagsUpdated) {
      this.setState({
        tagsShouldBeUpdated: true,
      });
      this.props.tagsUpdatedNotifier();
    }

    if (this.state.tagsShouldBeUpdated) {
      axiosInstance
        .get('/api/tagsAll')
        .then((response) => {
          let tags = tagsParseSort(response.data);
          let initSelTagsIds = [];

          if (this.props.initSelTagsIds[0] === '_all') {
            tags.forEach((tag) => {
              if (tag.level === 1) initSelTagsIds.push(tag._id);
            });
          } else initSelTagsIds = this.props.initSelTagsIds;
          const initSelTagsGis = tagsParseTree(tags, initSelTagsIds);
          const tagsMap = tagsParseMap(tags);
          for (const tagGi of initSelTagsGis) {
            tagsParseInitSel(tagGi, tags, tagsMap);
          }
          this.setState({ tags, tagsMap, tagsShouldBeUpdated: false });
        })
        .catch((e) => {
          console.log('TAGSMANAGER: Error loading tags');
        });
    }

    const tagsSelected = tagsParseSelection(this.state.tags);

    this.selectedIdsHandler(tagsSelected);
  }

  /** handling selection of tags */
  selectedHandler = (e, tagGi) => {
    const ct = this.state.tags[tagGi];
    const gisSelToggle = [tagGi];
    const gisSelValue1 = []; //assigning the value of e.target.checked
    const value1 = e.target.checked;
    const gisIndetTrue = [];
    const gisIndetFalse = [];
    const gisSelTrue = [];
    const gisSelFalse = [];
    /** handling self and descendants */
    if (ct.typeNode === true) {
      gisSelValue1.push(...this.state.tagsMap.get(tagGi).descendantsAll);
      gisIndetFalse.push(
        tagGi,
        ...this.state.tagsMap.get(tagGi).descendantsAllNodes
      );
    }
    /** handling ancestors chain if any */
    if (ct.parent) {
      /** initializing values for ancestor chain analysis based on current selection
       * DDS - direct descendants selected change value
       * DDI - direct descendants indeterminate change value
       */
      let childSelected,
        childIndeterminate = 0,
        totalDDS = 0,
        totalDDI = 0;

      if (e.target.checked) childSelected = 1;
      else childSelected = 0;
      let childGi = tagGi;
      let parent = this.state.tags[this.state.tagsMap.get(tagGi).parent]; //parent tag object
      while (parent) {
        /** getting max as number of descendants */
        
        const maxDD = this.state.tagsMap.get(parent.gi).descendantsDir.length;
        /** analyzing direct descendants, value of the changed child are taken from the initialized values or from the previous cycle of the loop */
        if (maxDD > 1) {
          let currDescSelected, currDescIndet;
          for (const descGi of this.state.tagsMap.get(parent.gi)
            .descendantsDir) {
            const descendant = this.state.tags[descGi];
            if (descGi !== childGi) {
              currDescSelected = Number(descendant.selected);
              currDescIndet = Number(descendant.indeterminate);
            } else {
              currDescSelected = childSelected;
              currDescIndet = childIndeterminate;
            }
            totalDDS += currDescSelected;
            totalDDI += currDescIndet;
          }
        } else {
          totalDDS = childSelected;
          totalDDI = childIndeterminate;
        }
        console.log(`${parent.name}: chGi - ${childGi}, chS - ${childSelected}, chI - ${childIndeterminate} maxDD - ${maxDD}, DDS - ${totalDDS}, DDI - ${totalDDI}`);
        if (totalDDS === maxDD) {
          childSelected = 1;
          childIndeterminate = 0;
          gisSelTrue.push(parent.gi);
          gisIndetFalse.push(parent.gi);
        } else if (totalDDS === 0 && totalDDI === 0) {
          childSelected = 0;
          childIndeterminate = 0;
          gisSelFalse.push(parent.gi);
          gisIndetFalse.push(parent.gi);
        } else if ((totalDDS > 0 && totalDDS < maxDD) || totalDDI > 0) {
          childSelected = 0;
          childIndeterminate = 1;
          gisSelFalse.push(parent.gi);
          gisIndetTrue.push(parent.gi);
        }

        if (parent.parent) {
          childGi = parent.gi;
          parent = this.state.tags[this.state.tagsMap.get(parent.gi).parent];
          
          totalDDS = 0;
          totalDDI = 0;
        } else break;
      }
    }
    this.stateUpdate([
      {
        key: 'selected',
        type: 'toggle',
        value: null,
        gis: gisSelToggle,
      },
      {
        key: 'selected',
        type: 'new',
        value: value1,
        gis: gisSelValue1,
      },
      {
        key: 'selected',
        type: 'new',
        value: true,
        gis: gisSelTrue,
      },
      {
        key: 'selected',
        type: 'new',
        value: false,
        gis: gisSelFalse,
      },
      {
        key: 'indeterminate',
        type: 'new',
        value: false,
        gis: gisIndetFalse,
      },
      {
        key: 'indeterminate',
        type: 'new',
        value: true,
        gis: gisIndetTrue,
      },
    ]);
  };

  treeExpansionHandler = () => {
    this.setState({
      treeExpanded: !this.state.treeExpanded,
    });
  };

  nodeExpandClickHandler = (e, tagGi, expanded) => {
    /** if not expanded - toggling expanded and toggling visible of direct descendents, if expanded - toggling expanded (if applicable) and visibility of all descendants */
    if (!expanded) {
      this.stateUpdate([
        {
          key: 'expanded',
          type: 'new',
          value: true,
          gis: [tagGi],
        },
        {
          key: 'visible',
          type: 'new',
          value: true,
          gis: this.state.tagsMap.get(tagGi).descendantsDir,
        },
      ]);
    } else {
      const gisExpand = [tagGi];
      gisExpand.push(...this.state.tagsMap.get(tagGi).descendantsAllNodes);
      const gisVisible = [];
      gisVisible.push(...this.state.tagsMap.get(tagGi).descendantsAll);

      this.stateUpdate([
        {
          key: 'expanded',
          type: 'new',
          value: false,
          gis: gisExpand,
        },
        {
          key: 'visible',
          type: 'new',
          value: false,
          gis: gisVisible,
        },
      ]);
    }
  };
  /** Updating value based on array of gis, name of the value and value.
   * Types of the update: (1) new (default), (2) togle, (3) increment, (4) function (function that takes gi as an argument)
   */
  stateUpdate(updates) {
    this.setState((prevState) => {
      const tags = [...prevState.tags];
      /** map of tags to update - deep cloning for immutability */
      const tagsToUpdate = new Map();
      for (const { gis } of updates) {
        for (const gi of gis) {
          const tag = { ...prevState.tags[gi] };
          tagsToUpdate.set(gi, tag);
        }
      }
      /** updating values */
      for (const { key, type, value, gis } of updates) {
        for (const gi of gis) {
          switch (type) {
            case 'increment':
              tagsToUpdate.get(gi)[key] = prevState.tags[gi][key] + value;
              break;
            case 'function':
              tagsToUpdate.get(gi)[key] = value(gi);
              break;
            case 'toggle':
              tagsToUpdate.get(gi)[key] = !prevState.tags[gi][key];
              break;
            default:
              tagsToUpdate.get(gi)[key] = value;
          }

          tags[gi] = tagsToUpdate.get(gi);
        }
      }
      return { tags };
    });
  }

  selectedIdsHandler = (selectedTags) => {
    const selectedIdsSet = new Set();
    const selectedIdsEP = [];
    for (const tag of selectedTags) {
      if (this.state.tagsMap.get(tag.gi).ancestors) {
        const ancGis = this.state.tagsMap.get(tag.gi).ancestors;
        for (let i = ancGis.length - 1; i >= 0; i--) {
          selectedIdsSet.add(this.state.tags[ancGis[i]]._id);
        }
      }
      selectedIdsSet.add(tag._id);
      selectedIdsEP.push(tag._id);
    }
    this.props.selectedTagsIdsHandler(
      Array.from(selectedIdsSet),
      selectedIdsEP
    );
  };

  tagEditClick = (e, tagGi) => {
    const tag = {};
    tag.name = this.state.tags[tagGi].name;
    tag.description = this.state.tags[tagGi].description;
    tag.level = this.state.tags[tagGi].level;
    tag._id = this.state.tags[tagGi]._id;
    tag.ancestorsIds = this.state.tags[tagGi].ancestors;
    /** getting ancestors names for fullpath if any
     * and getting array of siblings to check against input
     */
    const ancestorsGis = this.state.tagsMap.get(tagGi).ancestors;
    if (ancestorsGis) {
      const ancestorsNames = [];
      for (let i = ancestorsGis.length - 1; i >= 0; i--) {
        ancestorsNames.push(this.state.tags[ancestorsGis[i]].name);
      }
      tag.ancestorsNames = ancestorsNames.join('/');
      const parentGi = ancestorsGis[0];
      const siblingsGis = this.state.tagsMap.get(parentGi).descendantsDir;
      const siblingsNames = [];
      for (const siblingGi of siblingsGis) {
        siblingsNames.push(this.state.tags[siblingGi].name.toUpperCase());
      }
      tag.siblingsNames = siblingsNames.filter(
        (siblingName) => siblingName !== tag.name.toUpperCase()
      );
    }
    this.props.tagEditClick(tag);
  };

  tagAddChildClick = (e, tagGi) => {
    const tag = {};
    tag.level = +this.state.tags[tagGi].level + 1;
    tag.ancestorsIds = [];
    if (this.state.tags[tagGi].ancestors)
      tag.ancestorsIds.push(...this.state.tags[tagGi].ancestors);
    tag.ancestorsIds.push(this.state.tags[tagGi]._id);
    tag.parentId = this.state.tags[tagGi]._id;
    /** getting ancestors names for fullpath if any
     * and getting array of siblings to check against input
     */
    const ancestorsGis = this.state.tagsMap.get(tagGi).ancestors;
    let ancestorsNames = [];
    if (ancestorsGis) {
      for (let i = ancestorsGis.length - 1; i >= 0; i--) {
        ancestorsNames.push(this.state.tags[ancestorsGis[i]].name);
      }
    }
    ancestorsNames.push(this.state.tags[tagGi].name);
    tag.ancestorsNames = ancestorsNames.join('/');
    const siblingsGis = this.state.tagsMap.get(tagGi).descendantsDir;
    if (siblingsGis.length > 0) {
      tag.siblingsNames = [];
      for (const siblingGi of siblingsGis) {
        tag.siblingsNames.push(this.state.tags[siblingGi].name.toUpperCase());
      }
     
    }

    this.props.tagAddChildClick(tag);
  };

  tagAddClick = () => {
    const tag = {};
    tag.level = 1;
    tag.parentId = null;
    tag.ancestorsIds = null;
    tag.ancestorsNames = null;
    const siblingsGis = [];
    for (const tag of this.state.tags) {
      if (tag.level === 1) siblingsGis.push(tag.gi);
    }
    
    if (siblingsGis.length > 0) {
      tag.siblingsNames = [];
      for (const siblingGi of siblingsGis) {
        tag.siblingsNames.push(this.state.tags[siblingGi].name.toUpperCase());
      }

    }


    this.props.tagAddChildClick(tag);
  }

  tagDeleteClick = (e, tagGi) => {
    const tagsIds = [];
    tagsIds.push(this.state.tags[tagGi]._id);
    /** if descendants we add their ids to the array */
    if (this.state.tagsMap.get(tagGi).descendantsAll.length > 0) {
      this.state.tagsMap.get(tagGi).descendantsAll.forEach((descGi) => {
        tagsIds.push(this.state.tags[descGi]._id);
      })
    }

    /** passing current tag and descendants tag ids */
    this.props.tagDeleteClick(tagsIds)
  }

  render() {
    /** tree expanding */
    let tagsTree;
    if (this.state.treeExpanded) {
      tagsTree = (
        <TagsTree
          tags={this.state.tags}
          selectedHandler={this.selectedHandler}
          nodeExpandClickHandler={this.nodeExpandClickHandler}
          mode={this.props.mode}
          tagEditClick={this.tagEditClick}
          tagAddChildClick={this.tagAddChildClick}
          tagDeleteClick={this.tagDeleteClick}
        />
      );
    } else tagsTree = null;
    /** selection tags */
    const tagsSelected = tagsParseSelection(this.state.tags);

    return (
      <div className={classes.TagsBox}>
        <div className={classes.TagsSelection}>
          <TagsSelection
          tagsSelected={tagsSelected}
          treeExpansionClick={this.treeExpansionHandler}
          treeExpanded={this.state.treeExpanded}
          selectedHandler={this.selectedHandler}
          showSelectionBox={this.props.showSelectionBox}
          tagAddClick={this.tagAddClick}
          mode={this.props.mode}
        />
        </div>
        <div className={classes.TagsTree}>
          {tagsTree}
        </div>
        
      </div>
    );
  }
}

export default TagsManager;
