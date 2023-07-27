import {TResponseWithData} from "../types/respone-with-data.type";
import {IPaginationResponse} from "../types/pagination-response.interface";
import {TMeta} from "../types/meta.type";

export const DataWithPagination = <T, I, items extends keyof T, meta extends keyof I>(props: TResponseWithData<T, TMeta, 'items', 'meta'>) => {
    const {items, meta} = props;
    const dataWithPagination: IPaginationResponse<T> = {
        pageSize: meta.pageSize,
        page: meta.pageNumber,
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount:meta.totalCount,
        items: items
    }
    return dataWithPagination
}