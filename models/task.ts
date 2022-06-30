export interface ITask {
    manager: string,
    title: string, 
    files: string[],
    description: string,
    sphere: string,
    worker: string,
    isCompleted: boolean,
    requestsKeys: string[] ,
    address: string
}