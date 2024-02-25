import { User } from '../users/schema/user.schema';
import { UserViewType } from '../users/types/user-view.type';
import { deleteIDandV, simplefy } from './simplefy';

export const UserViewMapper = (user: User): UserViewType => {
  const simplefyUser = simplefy(user);
  const { __v, _id, accountData, ...other } = simplefyUser;
  const responseData = { ...accountData, id: _id };
  return deleteIDandV(responseData);
};
