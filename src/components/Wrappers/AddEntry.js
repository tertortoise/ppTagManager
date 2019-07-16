import React from 'react';

import EntryManager from '../../containers/EntryManager/EntryManager';

const EditEntry = props => {
  
  return (
    <EntryManager
      title=""
      description=""
      date={new Date().toISOString().substr(0, 10)}
      importance="medium"
      status="notStarted"
      tags={[]}
      mode='add'
      path='/api/postEntry'
      formIsValid={false}
    />
  );
};

export default EditEntry;

