import { createContext, SetStateAction, Dispatch } from 'react';
import { DurationUnitEnum } from '../../types';

type DashboardContext = {
  unit: DurationUnitEnum;
  setUnit: Dispatch<SetStateAction<DurationUnitEnum>>;
};

export const DashboardContext = createContext<DashboardContext>({
  unit: DurationUnitEnum.HOURS,
  setUnit: () => {},
});
