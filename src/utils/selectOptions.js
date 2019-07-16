const selectOptions = {
  importance: [
    {
      value: '_any',
      presentation: {
        rus: 'Любая',
        eng: 'Not defined',
      },
    },
    {
      value: 'low',
      presentation: {
        rus: 'Низкая',
        eng: 'Low',
      },
    },
    {
      value: 'medium',
      presentation: {
        rus: 'Средняя',
        eng: 'Medium',
      },
    },
    {
      value: 'high',
      presentation: {
        rus: 'Высокая',
        eng: 'High',
      },
    },
  ],
  status: [
    {
      value: '_any',
      presentation: {
        rus: 'Любой',
        eng: 'Not defined',
      },
    },
    {
      value: 'notStarted',
      presentation: {
        rus: 'Не началась',
      },
    },
    {
      value: 'wip',
      presentation: {
        rus: 'В работе',
      },
    },
    {
      value: 'completed',
      presentation: {
        rus: 'Завершена',
      },
    },
    {
      value: 'postponed',
      presentation: {
        rus: 'Отложена',
      },
    },
  ],
};

module.exports = selectOptions;
