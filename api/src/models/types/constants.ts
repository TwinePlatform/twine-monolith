export type Weekday =
  'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type CommonTimestamps = {
  createdAt: Date;
  modifiedAt?: Date;
  deletedAt?: Date;
};

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export enum DisabilityEnum {
  YES = 'yes',
  NO = 'no',
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export enum EthnicityEnum {
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export enum RegionEnum {
  EAST_MIDLANDS = 'East Midlands',
  EAST_ENGLAND = 'East of England',
  LONDON = 'London',
  NORTH_EAST = 'North East',
  NORTH_WEST = 'North West',
  SOUTH_EAST = 'South East',
  SOUTH_WEST = 'South West',
  WEST_MIDLANDS = 'West Midlands',
  YORKSHIRE_HUMBER = 'Yorkshire and the Humber',
  TEMPORARY_DATA = 'TEMPORARY DATA',
}

export enum SectorEnum {
  ART_CENTRE = 'Arts centre or facility',
  COMMUNITY_HUB = 'Community hub, facility or space',
  PUB_SHOP_CAFE = 'Community pub, shop or café',
  EMPLOYMENT_SUPPORT = 'Employment, training, business support or education',
  ENERGY = 'Energy',
  ENVIRONMENT = 'Environment or nature',
  FOOD = 'Food catering or production (incl. farming)',
  HEALTH = 'Health, care or wellbeing',
  HOUSING = 'Housing',
  FINANCIAL = 'Income or financial inclusion',
  SPORT = 'Sport & leisure',
  TRANSPORT = 'Transport',
  TOURISM = 'Visitor facilities or tourism',
  WASTE_RECYCLING = 'Waste reduction, reuse or recycling',
  TEMPORARY_DATA = 'TEMPORARY DATA',
}

export enum RoleEnum {
  VISITOR = 'VISITOR',
  VOLUNTEER = 'VOLUNTEER',
  VOLUNTEER_ADMIN = 'VOLUNTEER_ADMIN',
  CB_ADMIN = 'CB_ADMIN',
  FUNDING_BODY = 'FUNDING_BODY',
  TWINE_ADMIN = 'TWINE_ADMIN',
  SYS_ADMIN = 'SYS_ADMIN',
}
