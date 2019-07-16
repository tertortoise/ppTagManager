import React from 'react';

import Input from '../../components/FormElements/Input';
import Button from '../../components/FormElements/Button';
import classes from './EntryManager.module.scss';
import validate from '../../utils/inputValidation';
import TagsManager from '../Tags/TagsManager';
import axiosInstance from '../../axios';
import selectOptions from '../../utils/selectOptions';

class EntryManager extends React.Component {
  state = {
    /** Selection of tag _ids, current endpoint + ancestors */
    selectedTagsSearch: [], //search representation of tags id - includes ancestors
    selectedTagsEP: [], // ids of tags endpoints only
    /** state related to inputs */
    editForm: {
      title: {
        elementType: 'input',
        display: true,
        elementConfig: {
          type: 'text',
          placeholder: 'Название записи ...',
        },
        value: this.props.title,
        label: 'Название записи',
        validation: {
          required: true,
        },
        valid: this.props.mode === 'edit',
        touched: false,
      },
      description: {
        elementType: 'textarea',
        elementConfig: {
          placeholder: 'Содержание записи ...',
        },
        value: this.props.description,
        label: 'Детальное содержание',
        validation: null,
        valid: true,
        touched: false,
      },
      date: {
        elementType: 'input',
        display: true,
        elementConfig: {
          type: 'date',
        },
        value: new Date(this.props.date).toISOString().substr(0, 10),
        label: 'Дата',
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
      },
      importance: {
        elementType: 'select',
        elementConfig: {
          options: selectOptions.importance,
        },
        label: 'Важность',
        validation: null,
        defaultValue: this.props.importance,
        value: this.props.importance,
        valid: true,
      },
      status: {
        elementType: 'select',
        elementConfig: {
          options: selectOptions.status,
        },
        label: 'Статус',
        validation: null,
        defaultValue: this.props.status,
        value: this.props.status,
        valid: true,
      },
    },
    formIsValid: this.props.formIsValid,
    result: {
      visibility: false,
      message: '',
      payload: '',
    },
  };

  componentDidMount() {
    /** here we should check the mode (to be sent by App or by Link from the list of entries and if mode is 'edit' update the state to reflect current entry ) */
  }

  selectedTagsHandler = (selectedTagsSearch, selectedTagsEP) => {
    /** Managing state of selected tags _ids */
    this.setState((currState) => {
      const nextSelectedTagsEP = selectedTagsEP.join();
      const nextSelectedTagsSearch = selectedTagsSearch.join();
      const currSelectedTagsEP = currState.selectedTagsEP.join();
      const currSelectedTagsSearch = currState.selectedTagsSearch.join();

      if (
        nextSelectedTagsEP !== currSelectedTagsEP &&
        nextSelectedTagsSearch !== currSelectedTagsSearch
      ) {
        return {
          selectedTagsSearch,
          selectedTagsEP,
        };
      } else {
        return;
      }
    });
  };

  inputChangedHandler = (event, inputIdentifier) => {
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
  };

  entryPostHandler = () => {
    axiosInstance
      .post(this.props.path, {
        _id: this.props.id,
        title: this.state.editForm.title.value,
        description: this.state.editForm.description.value,
        date: this.state.editForm.date.value,
        importance: this.state.editForm.importance.value,
        status: this.state.editForm.status.value,
        selectedTagsSearch: this.state.selectedTagsSearch,
        selectedTagsEP: this.state.selectedTagsEP,
      })
      .then((response) => {
        const newResult = {
          ...this.state.result,
        };
        newResult.visibility = true;
        if (response.data) {
          newResult.payload = response.data.payload;
          if (response.data.type === 'addSuccess') {
            newResult.message = 'Добавлена новая запись';
          } else if (response.data.type === 'editSuccess') {
            newResult.message = 'Отредактирована запись';
          } else if (response.data.type === 'error') {
            newResult.message = 'Произошла ошибка';
          }
        }

        this.setState({ result: newResult });
      })
      .catch((e) => {
        const newResult = {
          ...this.state.result,
        };
        console.log(e.response);
        newResult.payload = `${e.message}`;
        newResult.visibility = true;
        newResult.message = `При добавлении записи возникла проблема`;
        this.setState({ result: newResult });
      });
  };

  render() {
    /** building inputs */

    const formElementsArray = [];
    for (let key in this.state.editForm) {
      formElementsArray.push({
        id: key,
        config: this.state.editForm[key],
      });
    }
    let form = formElementsArray.map((formElement) => (
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
    ));
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
    /** determine the name of the button */
    let buttonName;
    switch (this.props.mode) {
      case 'add': {
        buttonName = 'Добавить';
        break;
      }
      case 'edit': {
        buttonName = 'Редактировать';
        break;
      }
      default:
        buttonName = 'Выбрать';
    }

    /** extracting ids from the initial selection of tags for edit mode */
    let initSelTagsIds = [];
    for (const tag of this.props.tags) {
      initSelTagsIds.push(tag._id);
    }

    return (
      <div className={classes.EntryContainer}>
        <div className={classes.TagsContainer}>
          <TagsManager
            selectedTagsIdsHandler={this.selectedTagsHandler}
            initSelTagsIds={initSelTagsIds}
            showSelectionBox={true}
            mode={'entryManager'}
          />
        </div>
        <div className={classes.InputsContainer}>
          {form}
          <Button
            btnType='Success'
            disabled={
              !(
                Boolean(this.state.selectedTagsEP.length) &&
                this.state.formIsValid
              )
            }
            clicked={this.entryPostHandler}
          >
            {buttonName}
          </Button>
          <div className={classes.ResultSection}>{resultOutput}</div>
        </div>

        
      </div>
    );
  }
}

export default EntryManager;
