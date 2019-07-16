import React, { Component } from 'react';

import TagsNode from '../../components/Tags/TagsNode';

class TagsTree extends Component {
  render() {
    const tags = this.props.tags.map((tag, index) => {
      if (tag.visible) {
        return (
          <TagsNode
            key={tag.gi}
            {...tag}
            nodeExpandClick={(e) =>
              this.props.nodeExpandClickHandler(e, tag.gi, tag.expanded)
            }
            clickSelect={(e) => this.props.selectedHandler(e, tag.gi)}
            tagEditClick={(e) => this.props.tagEditClick(e, tag.gi)}
            tagDeleteClick={(e) => {
              if (
                window.confirm(
                  'Если к этому тэгу привязаны записи, тэг не будет удален. При удалении будут удалены также все дочерние тэги. Продолжаем?'
                )
              ) {
                return this.props.tagDeleteClick(e, tag.gi);
              }
            }}
            tagAddChildClick={(e) => this.props.tagAddChildClick(e, tag.gi)}
            mode={this.props.mode}
          />
        );
      }
    });
    return <div>{tags}</div>;
  }
}

export default TagsTree;
