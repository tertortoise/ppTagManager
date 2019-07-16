import React from 'react';
import { Link } from 'react-router-dom';

import TagsEntryLine from '../Tags/TagsEntryLine';
import classes from './EntryLine.module.scss';

const EntryLine = (props) => {
  return (
    <div className={classes.EntryLine}>
      <div className={classes.Contents}>
        <div className={`${classes.Line} ${classes.Title}`}>
          <span className={classes.Label}>Название</span>
          <span className={classes.LineContent}>{props.title}</span>
        </div>
        <div className={`${classes.Line} ${classes.Tags}`}>
          <span className={classes.Label}>Тэги</span>
          <span className={classes.LineContent}>
            <TagsEntryLine tags={props.tags} />
          </span>
        </div>
        <div className={`${classes.Line} ${classes.Description}`}>
          <span className={classes.Label}>Содержание</span>
          <span className={classes.LineContent}>{props.description}</span>
        </div>
      </div>
      <div className={classes.Attributes}>
        <p>{props.datePresent}</p>
        <p>{props.importancePresent}</p>
        <p>{props.statusPresent}</p>
        <div className={classes.Buttons}>
          <Link
            to={{
              pathname: '/editEntry',
              state: {
                entryData: {
                  title: props.title,
                  description: props.description,
                  date: props.date,
                  importance: props.importance,
                  status: props.status,
                  tags: [...props.tags],
                  id: props.id,
                },
              },
            }}
          >
            <button className={classes.Button}>Исправить</button>
          </Link>
          <button
            className={classes.Button}
            onClick={(e) => {
              if (window.confirm('Уверены, что хотите удалить эту запись?')) {
                return props.deleteClick(e, props.id);
              }
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryLine;
