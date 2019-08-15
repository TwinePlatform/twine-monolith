import * as moment from 'moment';


export const Age = {
  toBirthYear: (age: number) => moment().year() - age,
};

export const AgeList = {
  toBirthYear: (ages: number[]) => ages.map(Age.toBirthYear).reverse(),
};
