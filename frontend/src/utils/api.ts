import axiosInstance from "./axios"
import { AxiosResponse } from 'axios';

type loginPayload = {
    email:string,
    password:string,
}
type registerPayload = {
    username:string,
    email:string,
    password:string,
    city:string,
}

type productPayloadType = {
    name:string,
    desc:string,
    owner:string,
    image:string,
    price:string,
    condition:string,   
    gender:string,
    city:string,
    lat: number;
    lon: number;
    preciseLat: number, 
    preciseLon: number, 
    sold: boolean,
    boosted?: boolean;
    boostDays?: number;
}
 

type commentPayload = {
    text:string,
    user:string,
    product:string
}
// type transactionPayload={
//     seller:string,
//     buyer:string,
//     product:string,
//     totalPrice:number,
//     quantity:number,

// }
type ChatRoomPayload = {
    userId: string;
    recipientId: string;
    displayName1: string;
    displayName2: string;
};

type CheckoutPayload ={
    name: string,
    boostDays?: number;
}

type userUpdatePayload = {
    username?: string;
    email?: string;
    city?: string;
    contact?: string;
    about?: string;
    image?: string;
}

// auth routes 
export const loginApi = (data:loginPayload)=>axiosInstance.post("/auth/login",data)
export const signUpApi = (data:registerPayload)=>axiosInstance.post("/auth/register",data)
export const getSessionUser = ()=>axiosInstance.get("/user/sessionUser")
export const logOut = ()=>axiosInstance.post("/auth/logout")
export const verifyIfEmailConfirmationTokenIsValidApi=(hash:string)=>axiosInstance.post(`/auth/verifyConfirmationEmailHash`,{hash})
export const confirmEmailApi= (email:string,hash:string)=>axiosInstance.post("/auth/confirmEmail",{hash,email});
export const verifyAccountApi = (email:string)=>axiosInstance.post("/auth/verifyAccount",{email})
export const updateUserApi = (data: userUpdatePayload) => axiosInstance.put("/user", data);
export const sentConfirmationlinkApi =(email:string)=>axiosInstance.post("/auth/sentConfirmationlink",{email})


// category routes
export const allCategoryApi = ()=>axiosInstance.get("/category")



// product routes
export const AddProductApi = (data:productPayloadType)=>axiosInstance.post("/product/create",data)
export const getAllProductApi = ()=>axiosInstance.get("/product");
export const getSingleProductById=(productId:string)=>axiosInstance.get(`/product?_id=${productId}`)
export const getProductsbyCategoryApi=(category:string)=>axiosInstance.get(`/product?category=${category}`)
export const searchProductByInputApi =(search:string)=>axiosInstance.get(`/product/search?search=${search}`)
// export const updateProductApi = (productId: string, data: Partial<productPayloadType>) => axiosInstance.put(`/product/${productId}`, data);
export const deleteProductApi = (productId: string) => axiosInstance.delete(`/product/${productId}`);
export const updateProductApi = (productId: string, data: Partial<productPayloadType>): Promise<AxiosResponse> => 
    axiosInstance.put(`/product/${productId}`, data);
 



// comment route 


export const AddCommentApi=(data:commentPayload)=>axiosInstance.post("/comment/create",data)

export const getCommentOfProductApi = (productId:string)=>axiosInstance.get(`/comment/product/${productId}`)



// transaction route 


// export const createTransactionApi=(data:transactionPayload)=>axiosInstance.post("/transaction/create",data)
export const getTransactionForBuyerApi=(userId:true)=>axiosInstance.get(`/transaction/user?userId=${userId}&buyer=true`)
export const getTransactionForSellerApi=(userId:true)=>axiosInstance.get(`/transaction/user?userId=${userId}&seller=true`)


// Chat route


export const createChatRoomApi = (data: ChatRoomPayload) => axiosInstance.post("/chat/create-chat-room", data);
export const getChatRoomsApi = (userId: string) => axiosInstance.get(`/chat/chat-rooms/${userId}`);


// Chat route


// export const createCheckoutApi = (data: CheckoutPayload) => axiosInstance.post("/checkout/create-checkout-session", data);
export const createCheckoutApi =(data: CheckoutPayload) => axiosInstance.post("/checkout/create-checkout-session", data);
  

