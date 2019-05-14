import { evolve, map, pipe, assoc } from 'ramda';

interface Params {
  title: string;
  data: any;
}
export const aggregatedDataToTable = ({ title, data:   }: Params) => {
  const transformers = {
    rows: map((x: any) => map((y: any) => ({ content: y }))),
  };
  return pipe(
    evolve(transformers),
    assoc({ title })
    )(data);
};
