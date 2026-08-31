import type { Exercise } from '../schema/types';

const home = () => '/' as const;
export const uiRoutes = {
  basketBuilderAdd: (exerciseType: Exercise['type']) =>
    `${home()}?adding=${exerciseType}` as const,
  basketBuilderEdit: (exerciseIndex: number) =>
    `${home()}?editing=${exerciseIndex}` as const,
  home,
};
