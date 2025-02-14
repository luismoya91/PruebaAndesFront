export type UserType = {
    name:string,
    email:string,
    password:string,
    c_password:string
}

export type UserLoggedType = UserType & {
    id:number
    auth:boolean
}

export type TaskType= {
    name:string,
    description:string,
    created_at:string,
    updated_at:string,
    user:UserLoggedType
}

export type TaskObjectType = TaskType & {
    id:number
}