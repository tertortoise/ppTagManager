import React from 'react';

import EntryManager from '../../containers/EntryManager/EntryManager';

const EditEntry = props => {
  console.log(props);
  return (
    <EntryManager
      {...props.location.state.entryData}
      mode='edit'
      path='/api/updateEntry'
      formIsValid={true}
    />
  );
};

export default EditEntry;
