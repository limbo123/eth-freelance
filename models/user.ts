export interface IDeveloper {
    address: string,
    username: string,
    description: string,
    completedTasks: string[],
    email: string,
    password: string,
    rating: number,
    profilePhoto: string | ArrayBuffer | Uint8Array | Blob,
    type: string,
    sphere: string
}

export interface IEmployer {
    address: string,
    username: string,
    description: string,
    createdTasks: string[],
    moneysSpent: number,
    email: string,
    password: string,
    rating: number,
    profilePhoto: string | ArrayBuffer | Uint8Array | Blob,
    type: string,
    sphere: string
}