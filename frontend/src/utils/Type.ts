export type ProductType={
    image:string,
    name:string,
    desc:string, 
    owner:UserType,
    price:number,
    category:string,
    quantity:number,
    city:string,
    lat: number;
    lon: number;
    _id:string,
    gender:string,
    sold: boolean,
}
export type UserType={
    username:string,
    email:string,
    image:string,
    country:string,
    city:string,
    about:string,
    isVerfied:boolean,
    isAdmin:boolean,
    _id:string
}