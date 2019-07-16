import React from 'react';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import classes from './App.module.scss';
import Main from './containers/Main/Main';
import TagsEditor from './containers/Tags/TagsEditor';
import EditEntry from './components/Wrappers/EditEntry';
import AddEntry from './components/Wrappers/AddEntry';

class App extends React.Component {
  state = {
    filterConfig: {
      selectedTagsSearch: ['_all'], //search representation of tags id - includes ancestors
      selectedTagsEP: ['_all'], // ids of tags endpoints only
      importance: '_any',
      status: '_any',
      date1: '',
      date2: '',
    },
  };

  stateHandler = (filterConfig) => {
    this.setState({
      filterConfig: { ...filterConfig }, //destructuring?
    });
  };

  render() {
    return (
      <div className={classes.App}>
        <header className={classes.AppHeader}>
          <nav>
            <ul>
              <li>
                <NavLink activeStyle={{ textDecoration: 'underline' }} to='/' exact>
                  Главная
                </NavLink>
              </li>
              <li>
                <NavLink activeStyle={{ textDecoration: 'underline' }} to='/addEntry' exact>
                  Новая запись
                </NavLink>
              </li>
              <li>
              <NavLink activeStyle={{ textDecoration: 'underline' }} to='/editTag' exact>
                  Редактор тэгов
                </NavLink>
              </li>
             
            </ul>
          </nav>
        </header>
        <main>
          <Switch>
            <Route
              path='/'
              exact
              render={(props) => (
                <Main
                  {...props}
                  filterConfig={this.state.filterConfig}
                  configStateHandler={this.stateHandler}
                />
              )}
            />
            <Route path='/editEntry' component={EditEntry} />
            <Route path='/addEntry' component={AddEntry} />
            <Route path='/editTag' component={TagsEditor} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
