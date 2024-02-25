export const deleteIDandV = (data: any) => {
  const simpleData = simplefy(data);
  const { __v, _id, ...newData } = simpleData;
  return newData;
};

export const simplefy = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};
