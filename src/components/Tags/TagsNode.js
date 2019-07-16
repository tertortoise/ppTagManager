import React, { Component } from 'react';

import classes from './TagsNode.module.scss';

class TagsNode extends Component {
  constructor(props) {
    super(props);
    this.checkboxRef = React.createRef();
  }

  componentDidMount() {
    if (this.checkboxRef.current) {
      this.checkboxRef.current.indeterminate = this.props.indeterminate;
    }
  }

  componentDidUpdate() {
    if (this.checkboxRef.current) {
      this.checkboxRef.current.indeterminate = this.props.indeterminate;
    }
  }

  render() {
    /**Checking if expand button is required */
    let buttonExpandNode, buttonExpandNodeContent;
    if (this.props.hasOwnProperty('expanded')) {
      if (this.props.expanded) buttonExpandNodeContent = '\u{25BC}';
      else buttonExpandNodeContent = '\u{25B6}';
      buttonExpandNode = (
        <button
          className={classes.ButtonExpand}
          onClick={this.props.nodeExpandClick}
        >
          {buttonExpandNodeContent}
        </button>
      );
    } else {
      buttonExpandNode = null;
      buttonExpandNodeContent = null;
    }
    /** Determine padding-left based on the level of the tag */
    const padding = {
      paddingLeft: (this.props.level * 1.5).toString() + 'rem',
    };
    /** Setting checked as per 'selected' status */
    const checked = this.props.selected;
    let checkboxElement = (
      <input
        type='checkbox'
        onChange={this.props.clickSelect}
        checked={checked}
        ref={this.checkboxRef}
      />
    );
    /** Input checkbox visibility Additional buttons for 'tagsEditor mode */
    let buttonEditTag = null,
      buttonAddChildTag = null,
      buttonDeleteTag = null;
    if (this.props.mode === 'tagsEditor') {
      checkboxElement = null;
      buttonEditTag = (
        <button title={`Редактировать тэг ${this.props.name}`} onClick={this.props.tagEditClick}>
          	&#9997;
        </button>
      );
      buttonAddChildTag = (
        <button
          title={`Добавить новый дочерний тэг к тэгу ${this.props.name}`}
          onClick={this.props.tagAddChildClick}
        >
          	&#9166;
        </button>
      );
      buttonDeleteTag = (
        <button title={`Удалить тэг ${this.props.name}`} onClick={this.props.tagDeleteClick}>
          		&#128465;
        </button>
      );
    }
    return (
      <li className={classes.Tag} title={this.props.description}>
        <span className={classes.Buttons}>
          {buttonEditTag}
          {buttonDeleteTag}
          {buttonAddChildTag}
        </span>

        <span className={classes.Content} style={padding}>
          {buttonExpandNode}
          <label>
            {checkboxElement}
            <span className={classes.Label}>{this.props.name}</span>
          </label>
        </span>
      </li>
    );
  }
}

export default TagsNode;
