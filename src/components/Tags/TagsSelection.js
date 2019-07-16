import React from 'react';

import classes from './TagsSelection.module.scss';


const TagsSelection = props => {
  const { tagsSelected, treeExpanded, treeExpansionClick } = props;
  /** Defining the content of the expansion button */
  let buttonExpandedContent;
  if (treeExpanded) {
    buttonExpandedContent = '\u{25BC}';
  } else {
    buttonExpandedContent = '\u{25B2}';
  }
  /** Defining contents of the selected tags area */
  let selectionContent;
  if (tagsSelected.length === 0 || !props.showSelectionBox) {
    selectionContent = <span>Выберете тэги...</span>;
  } else {
    selectionContent = (
      <ul className={classes.SelectionItems}>
        {tagsSelected.map(tag => (
          <li
            className={classes.SelectionItem}
            gi={tag.gi}
            key={tag._id}
            title={tag.description}
          >
            <span>{tag.name}</span>
            <label title="Удалить выбранный тэг">
            &#10799;
              <input type='checkbox' onChange={e => props.selectedHandler(e, tag.gi)} checked />
            </label>
          </li>
        ))}
      </ul>
    );
  }
  /** Defining Add level 1 tag button */
  let buttonAddTag = null;
  if (props.mode === 'tagsEditor') {
    buttonAddTag = (
      <button className={classes.AddTag} title='Добавить новый тэг 1-го уровня' onClick={props.tagAddClick}>
        Новый тэг
      </button>
    );
  }

  return (
    <div className={classes.SelectionArea}>
      {selectionContent}
      <button onClick={treeExpansionClick}>{buttonExpandedContent}</button>
      {buttonAddTag}
    </div>
  );
};

export default TagsSelection;
