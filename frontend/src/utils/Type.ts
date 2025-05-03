// export type ProductType={
//     image:string,
//     name:string,
//     desc:string, 
//     owner:UserType,
//     price:number,
//     category:string,
//     quantity:number,
//     city:string,
//     lat: number;
//     lon: number;
//     _id:string,
//     gender:string,
//     sold: boolean,
// }
// export type UserType={
//     username:string,
//     email:string,
//     image:string,
//     country:string,
//     city:string,
//     about:string,
//     isVerfied:boolean,
//     isAdmin:boolean,
//     _id:string
// }

// types.ts - Central type definitions based on MongoDB schemas

// MongoDB ID type for consistency
export type ObjectId = string;

/**
 * User type representing the user document in MongoDB
 */
export interface UserType {
  _id?: ObjectId;
  username: string;
  email: string;
  password?: string; // Optional in frontend context for security
  city: string;
  contact?: string;
  about?: string;
  image?: string;
  isAdmin: boolean;
  isVerfied?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Category type representing the category document in MongoDB
 */
export interface CategoryType {
  _id?: ObjectId;
  categoryName: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Message type used in ChatRoom
 */
export interface MessageType {
  _id?: ObjectId;
  userId: ObjectId;
  message: string;
  timestamp: Date;
}

/**
 * ChatRoom type representing chat rooms between users
 */
export interface ChatRoomType {
  _id?: ObjectId;
  room: string;
  users: ObjectId[];
  displayName1: string;
  displayName2: string;
  messages: MessageType[];
}

/**
 * Comment type for product comments
 */
export interface CommentType {
  _id?: ObjectId;
  user: ObjectId | UserType; // Can be populated with user object
  text: string;
  product: ObjectId | ProductType; // Can be populated with product object
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Product type representing products for sale
 */
export interface ProductType {
  _id?: ObjectId;
  name: string;
  desc: string;
  owner: ObjectId | UserType; // Can be populated with user object
  image?: string;
  price: string;
  category: string;
  condition: "New" | "Like new" | "Used";
  gender: "Male" | "Female" | "Other";
  city: string;
  lat: number;
  lon: number;
  preciseLat?: number;
  preciseLon?: number;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  sold: boolean;
  boosted?: boolean;
  boostDays?: number;
  boostEndDate?: Date;
  reviewed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Component Props Types

/**
 * SideBar component props
 */
export interface SideBarProps {
  setCurrentCategory: (category: string) => void;
  activeCat: string;
}

/**
 * ThriftState for context
 */
export interface ThriftState {
  user: UserType | null;
  refresh: boolean;
}

/**
 * Possible actions for ThriftContext reducer
 */
export type ThriftAction =
  | { type: "addUser"; payload: UserType }
  | { type: "removeUser" }
  | { type: "setRefresh" };

/**
 * ThriftContext value type
 */
export interface ThriftContextValue {
  state: ThriftState;
  dispatch: React.Dispatch<ThriftAction>;
}

/**
 * Props for ThriftContextProvider
 */
export interface ThriftContextProviderProps {
  children: React.ReactNode;
}

// Add more component props interfaces as needed below