exports.seed = (knex) =>
  knex('ethnicity').del()
    .then(() =>
      knex('ethnicity').insert([
        { ethnicity_name: 'prefer not to say' },
        { ethnicity_name: '🎶' },
        { ethnicity_name: 'cos' },
        { ethnicity_name: 'it' },
        { ethnicity_name: 'don\'t' },
        { ethnicity_name: 'matter' },
        { ethnicity_name: 'if' },
        { ethnicity_name: 'you\'re' },
        { ethnicity_name: 'black' },
        { ethnicity_name: 'or' },
        { ethnicity_name: 'white' },
      ])
    )

