import React, { Component } from 'react';

import classes from './TagsEditor.module.scss';
import TagsManager from './TagsManager';
import Input from '../../components/FormElements/Input';
import Button from '../../components/FormElements/Button';
import validate from '../../utils/inputValidation';
import axiosInstance from '../../axios';

class TagsEditor extends Component {
  state = {
    initSelTagsIds: [],
    currentTagId: '',
    ancestorsIds: [],
    parentId: '',
    editForm: {
      fullPath: {
        elementType: 'input',
        display: true,
        elementConfig: {
          type: 'text',
          placeholder: null,
          readOnly: true,
        },
        value: '',
        label: 'Родительские тэги',
        validation: null,
        valid: true,
        touched: false,
      },
      level: {
        elementType: 'input',
        display: true,
        elementConfig: {
          type: 'text',
          placeholder: null,
          readOnly: true,
        },
        value: '',
        label: 'Уровень иерархии тэга',
        validation: null,
        valid: true,
        touched: false,
      },
      name: {
        elementType: 'input',
        display: true,
        elementConfig: {
          type: 'text',
          placeholder: 'Название тэга ...',
          readOnly: false,
        },
        value: '',
        label: 'Название тэга',
        validation: {
          required: true,
          notEqualList: null,
        },
        valid: false,
        touched: false,
      },
      description: {
        elementType: 'textarea',
        display: true,
        elementConfig: {
          placeholder: 'Описание тэга, появляется при наведении курсора ...',
        },
        value: this.props.description,
        label: 'Описание тэга',
        validation: null,
        valid: true,
        touched: false,
      },
    },
    editMode: {
      type: null,
      buttonName: '',
      path: '/api/updateTag',
    },
    formIsValid: false,
    result: {
      visibility: false,
      message: '',
      payload: '',
    },
    tagsUpdated: false,
  };

  selectedTagsHandler() {
    return null;
  }

  tagsUpdatedNotifier = () => {
    this.setState((currState) => {
      if (!currState.tagsUpdated) {
        return null;
      } else
        return {
          tagsUpdated: false,
        };
    });
  };

  tagEditHandler = (tag) => {
    /** setting input values from the selected tag values */

    const editForm = [];
    let parentId;
    for (let key in this.state.editForm) {
      editForm[key] = { ...this.state.editForm[key] };
    }
    if (tag.ancestorsNames) {
      editForm.fullPath.value = tag.ancestorsNames;
      editForm.fullPath.display = true;
      parentId = tag.ancestorsIds[tag.ancestorsIds.length - 1];
    } else editForm.fullPath.display = false;
    editForm.level.value = tag.level;
    editForm.name.value = tag.name;
    editForm.name.valid = true;
    editForm.description.value = tag.description;
    editForm.name.validation.notEqualList = tag.siblingsNames;
    /** setting mode to 'edit' to change button name*/
    const editMode = {
      type: 'edit',
      buttonName: 'Редактировать',
      path: '/api/updateTag',
    };

    this.setState({
      currentTagId: tag._id,
      ancestorsIds: tag.ancestorsIds,
      parentId,
      editForm,
      editMode,
      formIsValid: true,
    });
  };

  tagAddChildHandler = (tag) => {
    /** setting input values from the selected tag values */
    const editForm = [];
    let parentId = tag.parentId;
    for (let key in this.state.editForm) {
      editForm[key] = { ...this.state.editForm[key] };
    }
    if (tag.ancestorsNames) {
      editForm.fullPath.value = tag.ancestorsNames;
      editForm.fullPath.display = true;
    } else {
      editForm.fullPath.value = null;
      editForm.fullPath.display = false;
    }

    editForm.level.value = tag.level;
    editForm.name.value = '';
    editForm.description.value = '';
    editForm.name.validation.notEqualList = tag.siblingsNames;
    console.log(tag.siblingsNames);
    /** setting mode to 'edit' to change button name*/
    const editMode = {
      type: 'add',
      buttonName: 'Добавить',
      path: '/api/postTag',
    };

    this.setState({
      currentTagId: undefined,
      ancestorsIds: tag.ancestorsIds,
      parentId,
      editForm,
      editMode,
      formIsValid: false,
    });
  };

  tagDeleteHandler = (tagsIds) => {
    console.log(tagsIds);
    axiosInstance
      .post('/api/deleteTag', {
        ids: tagsIds,
      })
      .then((response) => {
        const newResult = {
          ...this.state.result,
        };
        newResult.visibility = true;
        if (response.data) {
          newResult.payload = response.data.payload;
          if (response.data.type === 'deleteTagUnsuccess') {
            newResult.message = 'Не удалось удалить тэг. К нему или его потомкам привязаны записи в количестве';
          } else if (response.data.type === 'deleteTagSuccess') {
            newResult.message = 'Успешно удален(ы) тэг(и) в количестве';
          } else if (response.data.type === 'error') {
            newResult.message = 'Произошла ошибка';
          }
        }
        this.setState({ tagsUpdated: true, result: newResult });
      })
      .catch((e) => {
        const newResult = {
          ...this.state.result,
        };
        
        newResult.payload = `${e.message}`;
        newResult.visibility = true;
        newResult.message = `При транзакции возникла проблема`;
        this.setState({ result: newResult });
      });
  };

  tagPostHandler = () => {
    axiosInstance
      .post(this.state.editMode.path, {
        _id: this.state.currentTagId,
        name: this.state.editForm.name.value,
        description: this.state.editForm.description.value,
        level: this.state.editForm.level.value,
        ancestors: this.state.ancestorsIds,
        parent: this.state.parentId,
      })
      .then((response) => {
        const newResult = {
          ...this.state.result,
        };
        newResult.visibility = true;
        if (response.data) {
          newResult.payload = response.data.payload;
          if (response.data.type === 'addTagSuccess') {
            newResult.message = 'Добавлен новый тэг';
          } else if (response.data.type === 'updateTagSuccess') {
            newResult.message = 'Отредактирован тэг';
          } else if (response.data.type === 'error') {
            newResult.message = 'Произошла ошибка';
          }
        }

        this.setState({ tagsUpdated: true, result: newResult });
      })
      .catch((e) => {
        const newResult = {
          ...this.state.result,
        };
        console.log(e.response);
        newResult.payload = `Ошибка: ${e.message}`;
        newResult.visibility = true;
        newResult.message = `При транзакции возникла проблема`;
        this.setState({ result: newResult });
      });
  };

  inputChangedHandler(event, inputIdentifier) {
    const updatedEditForm = {
      ...this.state.editForm,
    };
    const updatedFormElement = {
      ...updatedEditForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    if (updatedFormElement.validation) {
      updatedFormElement.valid = validate(
        updatedFormElement.value,
        updatedFormElement.validation
      );
    }
    updatedFormElement.touched = true;
    updatedEditForm[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedEditForm) {
      formIsValid = updatedEditForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ editForm: updatedEditForm, formIsValid: formIsValid });
  }

  render() {
    /** edit tag form */
    let form, button;
    if (this.state.editMode.type) {
      const formElementsArray = [];
      for (let key in this.state.editForm) {
        formElementsArray.push({
          id: key,
          config: this.state.editForm[key],
        });
      }
      form = formElementsArray.map((formElement) => {
        if (!formElement.config.display) return null;

        return (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            label={formElement.config.label}
            value={formElement.config.value}
            defaultValue={formElement.config.defaultValue}
            invalid={!formElement.config.valid}
            touched={formElement.config.touched}
            shouldValidate={formElement.config.validation}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        );
      });
      /** button */

      button = (
        <Button
          btnType='Success'
          disabled={!this.state.formIsValid}
          clicked={this.tagPostHandler}
        >
          {this.state.editMode.buttonName}
        </Button>
      );
    }

    /** message on the add/update transaction */
    let resultOutput = null;
    if (this.state.result.visibility) {
      resultOutput = (
        <React.Fragment>
          <span>{this.state.result.message}: </span>
          <span>{this.state.result.payload}</span>
        </React.Fragment>
      );
    }

    return (
      <div className={classes.EntryContainer}>
        <div className={classes.TagsContainer}>
          <TagsManager
            selectedTagsIdsHandler={this.selectedTagsHandler}
            initSelTagsIds={this.state.initSelTagsIds}
            showSelectionBox={false}
            mode='tagsEditor'
            tagEditClick={this.tagEditHandler}
            tagDeleteClick={this.tagDeleteHandler}
            tagsUpdated={this.state.tagsUpdated}
            tagsUpdatedNotifier={this.tagsUpdatedNotifier}
            tagAddChildClick={this.tagAddChildHandler}
            tagAddClick={this.tagAddHandler}
          />
        </div>
        <div className={classes.InputsContainer}>{form}{button}
        <div className={classes.ResultSection}>{resultOutput}</div>
        </div>
        
        
      </div>
    );
  }
}

export default TagsEditor;
