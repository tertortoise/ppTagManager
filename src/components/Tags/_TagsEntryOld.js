import React from 'react';
import classes from './TagsEntry.module.scss';

const Tags = props => {
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

  const parseTags = (array, currentLevel = [], level = 1) => {
    if (currentLevel.length === 0) {
      currentLevel = array.filter(tag => tag.level === level);
    }
    currentLevel.sort(sortArrayObj('name'));
    return [].concat(
      ...currentLevel.map(tagCL => {
        let nextLevelChildren = array.filter(tagNL => {
          return +tagNL.level === +level + 1 && tagCL._id === tagNL.parent;
        });
        if (nextLevelChildren.length === 0) {
          return (
            <p
              key={tagCL._id}
              className={classes[`tag${level.toString().padStart(2, '0')}`]}
            >
              {'-'.repeat(level - 1) + ' ' + tagCL.name}
            </p>
          );
        } 
        else
          return [].concat(
            (<p
              key={tagCL._id}
              className={classes[`tag${level.toString().padStart(2, '0')}`]}
            >
              {'-'.repeat(level - 1) + ' ' + tagCL.name}
            </p>),
            ...parseTags(array, nextLevelChildren, level + 1)
          );
      })
    );
  };
  let tags;
  if (!props.tags.length) {
    tags = 'Без тэга (категории)';
  } else {
    tags = parseTags(props.tags);
  }

  return <React.Fragment>{tags}</React.Fragment>;
};

export default Tags;
