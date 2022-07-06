import { IDeveloper } from './user';
export interface IRequest {
    body: {
        0: string,
        1: string,
        2: boolean,
        description: string,
        author: string,
        exist: boolean
    },
    author: any
}