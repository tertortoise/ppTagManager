import React from 'react';

import classes from './TagsEntryLine.module.scss';
 
const TagsEntryLine = (props) => {
  
  const parseTags = (tags) => {
    return tags.map(tag => {
      const currTag = <span className={classes.TagName}>{tag.name + " "}</span>;
      if (tag.ancestors && tag.ancestors.length > 0) {
        const path = tag.ancestors.map(ancestor => {
          return ancestor.name;
        });
        return <span key={tag._id}  className={classes.Tag}>{currTag}<span className={classes.TagPath}>{'(' + path.join('/') + '/' + tag.name + ')'}</span></span>
      } else return  <span key={tag._id} className={classes.Tag}>{currTag}</span>
    })
  };
  
  let tags;
  if (!props.tags.length) {
    tags = 'Без тэга (категории)';
  } else {
    tags = parseTags(props.tags);
  }

  return (
    <React.Fragment>
      {tags}
    </React.Fragment>
  );
}
 
export default TagsEntryLine;

// selectedTagsEP: [
//   {
//     parent: '5ccbd7909b09b024caadf24a',
//     ancestors: [
//       { _id: '5ccbd769c8504f249016d3da', name: 'Work' },
//       { _id: '5ccbd7909b09b024caadf24a', name: 'Project1' },
//     ],
//     _id: '5ccbd7b75f39702501bb4347',
//     name: 'Stage1',
//     description: 'Description of stage1 of project 1',
//     level: 3,
//     __v: 0,
//   },
// ],