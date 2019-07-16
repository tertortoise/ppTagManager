import React, { Component } from 'react';

import axiosInstance from '../../axios';
import classes from './Main.module.scss';
import EntryLine from '../../components/EntryLine/EntryLine';
import selectOptions from '../../utils/selectOptions';
import TagsManager from '../Tags/TagsManager';
import Input from '../../components/FormElements/Input';
import Button from '../../components/FormElements/Button';

class Main extends Component {
  state = {
    filterConfig: {
      selectedTagsSearch: this.props.filterConfig.selectedTagsSearch, //search representation of tags id - includes ancestors
      selectedTagsEP: this.props.filterConfig.selectedTagsEP, // ids of tags endpoints only
      importance: this.props.filterConfig.importance,
      status: this.props.filterConfig.status,
      date1: this.props.filterConfig.date1,
      date2: this.props.filterConfig.date2,
    },
    selectedTagsSearch: this.props.filterConfig.selectedTagsSearch, //search representation of tags id - includes ancestors
    selectedTagsEP: this.props.filterConfig.selectedTagsEP,
    editForm: {
      date1: {
        elementType: 'input',
        elementConfig: {
          type: 'date',
        },
        value: this.props.filterConfig.date1,
        label: 'От даты (включительно)',
      },
      date2: {
        elementType: 'input',
        elementConfig: {
          type: 'date',
        },
        value: this.props.filterConfig.date2,
        label: 'До даты (включительно)',
      },
      importance: {
        elementType: 'select',
        elementConfig: {
          options: selectOptions.importance,
        },
        label: 'Важность',
        value: this.props.filterConfig.importance,
        defaultValue: this.props.filterConfig.importance,
      },
      status: {
        elementType: 'select',
        elementConfig: {
          options: selectOptions.status,
        },
        label: 'Статус',
        value: this.props.filterConfig.status,
        defaultValue: this.props.filterConfig.status,
      },
    },
    filterRelevant: true,
    entries: [],
    entriesVisMap: new Map(),
  };

  componentDidMount() {
    axiosInstance
      .get('/api/entriesAll')
      .then((response) => {
        const entries = response.data;
        this.entriesFiltering(entries);
        this.setState({ entries });
      })
      .catch((e) => {
        console.log('MAIN: Error loading entries');
      });
  }

  componentWillUnmount() {
    this.props.configStateHandler(this.state.filterConfig);
  }

  selectedTagsHandler = (selectedTagsSearch, selectedTagsEP) => {
    /** Managing state of selected tags _ids */

    this.setState((currState) => {
      /** preventing toggle of the filterRelevant on initial selection of all level 1 tags */
      let filterRelevant;
      if (
        currState.selectedTagsEP[0] === '_all' ||
        currState.selectedTagsSearch[0] === '_all'
      ) {
        filterRelevant = true;
        const filterConfig = { ...currState.filterConfig };
        filterConfig.selectedTagsEP = selectedTagsEP;
        filterConfig.selectedTagsSearch = selectedTagsSearch;
        return {
          filterConfig,
          selectedTagsEP,
          selectedTagsSearch,
          filterRelevant,
        };
      }

      const nextSelectedTagsEP = selectedTagsEP.join();
      const nextSelectedTagsSearch = selectedTagsSearch.join();
      const currSelectedTagsEP = currState.selectedTagsEP.join();
      const currSelectedTagsSearch = currState.selectedTagsSearch.join();

      if (
        nextSelectedTagsEP !== currSelectedTagsEP &&
        nextSelectedTagsSearch !== currSelectedTagsSearch
      ) {
        if (
          currState.selectedTagsEP[0] === '_all' ||
          currState.selectedTagsSearch[0] === '_all' ||
          selectedTagsSearch.length === 0 ||
          selectedTagsEP.length === 0
        ) {
          filterRelevant = true;
        } else filterRelevant = false;

        return {
          selectedTagsEP,
          selectedTagsSearch,
          filterRelevant,
        };
      } else {
        return null;
      }
    });
  };

  inputChangedHandler = (event, inputIdentifier) => {
    /** checking correctness of dates */
    let filterRelevant;
    if (inputIdentifier === 'date1') {
      const currDate2 = new Date(this.state.editForm.date2.value).getTime();
      const nextDate1 = new Date(event.target.value).getTime();
      if (
        Number.isNaN(currDate2) ||
        Number.isNaN(nextDate1) ||
        nextDate1 <= currDate2
      ) {
        filterRelevant = false;
      } else {
        filterRelevant = true;
      }
    } else if (inputIdentifier === 'date2') {
      const currDate1 = new Date(this.state.editForm.date1.value).getTime();
      const nextDate2 = new Date(event.target.value).getTime();
      if (
        Number.isNaN(currDate1) ||
        Number.isNaN(nextDate2) ||
        currDate1 <= nextDate2
      ) {
        filterRelevant = false;
      } else {
        filterRelevant = true;
      }
    } else filterRelevant = false;

    const updatedEditForm = {
      ...this.state.editForm,
    };
    const updatedFormElement = {
      ...updatedEditForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedEditForm[inputIdentifier] = updatedFormElement;

    this.setState({ editForm: updatedEditForm, filterRelevant });
  };

  entryDeleteHandler = (e, id) => {
    axiosInstance
      .delete('/api/deleteEntry/' + id)
      .then((response) => {
        return axiosInstance.get('/api/entriesAll');
      })
      .then((response) => {
        const entries = response.data;
        this.setState({ entries });
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  entriesFiltering = (
    entries = this.state.entries,
    filterConfig = this.state.filterConfig
  ) => {
    const entriesVisMap = new Map();
    entries.forEach((entry, entryIndex) => {
      let tagsCheck = false,
        date1Check = true,
        date2Check = true,
        importanceCheck = true,
        statusCheck = true;
      /** checking if any of tags is present in entry searchtags array */
      for (const tag of filterConfig.selectedTagsEP) {
        if (entry.selectedTagsSearch.includes(tag)) {
          tagsCheck = true;
          break;
        } else continue;
      }
      /** checking dates */
      const entryDate = new Date(entry.date).getTime();
      const date1 = new Date(filterConfig.date1).getTime();
      const date2 = new Date(filterConfig.date2).getTime();
      if (!Number.isNaN(date1)) date1Check = entryDate >= date1;
      if (!Number.isNaN(date2)) date2Check = entryDate <= date2;
      /** checking importance and status */
      if (filterConfig.importance !== '_any') {
        importanceCheck = entry.importance === filterConfig.importance;
      }
      if (filterConfig.status !== '_any') {
        statusCheck = entry.status === filterConfig.status;
      }

      /** setting new Visibility Map */
      entriesVisMap.set(
        entry._id,
        tagsCheck && date1Check && date2Check && importanceCheck && statusCheck
      );
    });
    this.setState({
      entriesVisMap,
    });
  };

  entriesFilterHandler = () => {
    //we need to setState of FilterConfig here to ensure sync between entrylines and filterconfig
    const filterConfig = { ...this.state.filterConfig };
    filterConfig.date1 = this.state.editForm.date1.value;
    filterConfig.date2 = this.state.editForm.date2.value;
    filterConfig.importance = this.state.editForm.importance.value;
    filterConfig.status = this.state.editForm.status.value;
    filterConfig.selectedTagsEP = [...this.state.selectedTagsEP];
    filterConfig.selectedTagsSearch = [...this.state.selectedTagsSearch];
    this.entriesFiltering(undefined, filterConfig);
    this.setState({ filterConfig, filterRelevant: true });
  };

  render() {
    /** filter */
    const initSelTagsIds = this.props.filterConfig.selectedTagsEP;

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
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
        showAny={true}
      />
    ));

    /** building entrilines */
    let entryLines;
    let entriesToShow = 0;
    entryLines = this.state.entries.map((entry, index) => {
      /** checking entriesVisMap */
      if (!this.state.entriesVisMap.get(entry._id)) return null;
      entriesToShow++;
      /** formatting of some fields: date, importance, status */
      const dateObj = new Date(entry.date);
      const date = dateObj
        .getDate()
        .toString()
        .padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const dateFormatted = date + '.' + month + '.' + dateObj.getFullYear();
      const [{ presentation: importance }] = selectOptions.importance.filter(
        (option) => option.value === entry.importance
      );
      const [{ presentation: status }] = selectOptions.status.filter(
        (option) => option.value === entry.status
      );
      /** getting rendering result */
      return (
        <EntryLine
          key={entry._id}
          title={entry.title}
          description={entry.description}
          datePresent={dateFormatted}
          date={entry.date}
          importancePresent={importance.rus}
          importance={entry.importance}
          statusPresent={status.rus}
          status={entry.status}
          tags={entry.selectedTagsEP}
          id={entry._id}
          deleteClick={this.entryDeleteHandler}
        />
      );
    });

    if (!this.state.entries.length || entriesToShow === 0) {
      entryLines = 'Нет записей, удовлетворяющих условиям!';
    }

    return (
      <div className={classes.Main}>
        <div className={classes.Filter}>
          <div className={classes.TagsContainer}>
            <TagsManager
              selectedTagsIdsHandler={this.selectedTagsHandler}
              initSelTagsIds={initSelTagsIds}
              showSelectionBox={false}
              mode='filter'
            />
          </div>
          <div className={classes.Inputs}>{form}</div>
          <div className={classes.Button}>
            <Button
              disabled={this.state.filterRelevant}
              btnType='Success'
              clicked={this.entriesFilterHandler}
            >
              Применить фильтр
            </Button>
          </div>
        </div>
        <div className={classes.EntryLines}>{entryLines}</div>
      </div>
    );
  }
}

export default Main;
