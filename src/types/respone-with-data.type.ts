export type TResponseWithData<T, U, Key1 extends string, Key2 extends string> = {
  [K in Key1 | Key2]: K extends Key1 ? T : U
};