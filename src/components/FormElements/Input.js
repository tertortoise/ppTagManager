import React from 'react';

import classes from './Input.module.scss';

const Input = props => {
  let inputElement = null;

  const inputClasses = ['Input'];
  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push('Invalid');
  }

  switch (props.elementType) {
    case 'input':
      inputElement = (
        <label><span>{props.label}</span>
          
          <input
            type={props.elementConfig.type}
            className={inputClasses.join(' ')}
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
          />
        </label>
      );
      break;
    case 'textarea':
      inputElement = (
        <label><span>{props.label}</span>
          
          <textarea
            className={inputClasses.join(' ')}
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
          />
        </label>
      );
      break;

    case 'select':
      //let defaultValue;
      const options = props.elementConfig.options.map(option => {
        if (option.value === '_any' && !props.showAny) return null;
        else return (
          <option key={option.value} value={option.value}>
            {option.presentation.rus}
          </option>
        );
      });
      inputElement = (
        <label>
          <span>{props.label}</span>
          
          <select defaultValue={props.defaultValue} onChange={props.changed}>
            {options}
          </select>
        </label>
      );
      break;

    default:
      inputElement = (
        <label>
          <input
            className={inputClasses.join(' ')}
            {...props.elementConfig}
            value={props.value}
          />
        </label>
      );
  }

  return <div className={classes.Input}>{inputElement}</div>
};

export default Input;
