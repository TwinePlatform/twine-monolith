import * as Knex from 'knex';

exports.seed = (knex: Knex) =>
  knex('ethnicity').del()
    .then(() =>
      knex('ethnicity').insert([
        { ethnicity_name: 'prefer not to say' },
        { ethnicity_name: 'english/welsh/scottish/northern irish/british' },
        { ethnicity_name: 'irish' },
        { ethnicity_name: 'gypsy or white traveller' },
        { ethnicity_name: 'any other white background' },
        { ethnicity_name: 'white and black caribbean' },
        { ethnicity_name: 'white and black african' },
        { ethnicity_name: 'white and asian' },
        { ethnicity_name: 'any other mixed/multiple ethnic background' },
        { ethnicity_name: 'indian' },
        { ethnicity_name: 'pakistani' },
        { ethnicity_name: 'bangladeshi' },
        { ethnicity_name: 'chinese' },
        { ethnicity_name: 'any other asian background' },
        { ethnicity_name: 'african' },
        { ethnicity_name: 'caribbean' },
        { ethnicity_name: 'any other black/african/caribbean background' },
        { ethnicity_name: 'arab' },
        { ethnicity_name: 'any other ethnic background' },
      ])
    );
