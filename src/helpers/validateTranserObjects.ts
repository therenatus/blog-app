import { validateOrReject } from 'class-validator';

export const validate0rRejectModel = async (
  model: any,
  ctor: { new (): any },
) => {
  if (!(model instanceof ctor)) {
    throw new Error('Incorrect input data');
  }
  try {
    await validateOrReject(model);
  } catch (error) {
    throw new Error(error);
  }
};
