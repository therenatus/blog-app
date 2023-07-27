export interface IQuery {
  searchNameTerm: string | null,
  searchEmailTerm: string | null,
  searchLoginTerm: string | null,
  sortBy: string,
  sortDirection: directionEnum,
  pageNumber: number,
  pageSize: number
}

enum directionEnum  {
  ASC ='asc',
  DESC = 'desc',
}