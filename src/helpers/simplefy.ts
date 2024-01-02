export const deleteIDandV = (data: any) => {
  const simplefy = JSON.parse(JSON.stringify(data));
  const { __v, _id, ...newData } = simplefy;
  return newData;
};
