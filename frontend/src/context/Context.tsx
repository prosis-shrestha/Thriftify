import React, { Dispatch, useReducer, useContext } from "react";
import { UserType } from "../utils/type";

// type UserType = {
//   username: string;
//   email: string;
//   about: string;
//   isAdmin: boolean;
//   image?: string;
//   _id?: string;
//   city?: string;
//   contact?: string;
// };

interface ThriftState {
  user: UserType | null;
  refresh: boolean;
}

const initialState: ThriftState = {
  user: null,
  refresh: false,
};

type ThriftContextValue = {
  state: ThriftState;
  dispatch: Dispatch<ThriftAction>;
};

type ThriftAction =
  | { type: "addUser"; payload: UserType }
  | { type: "removeUser" }
  | { type: "setRefresh" };

export const ThriftContext = React.createContext<
  ThriftContextValue | undefined
>(undefined);

const thriftReducer = (state: ThriftState, action: ThriftAction) => {
  switch (action.type) {
    case "addUser":
      return { ...state, user: action.payload };

    case "removeUser":
      return { ...state, user: null };

    case "setRefresh":
      return { ...state, refresh: !state.refresh };

    default:
      return state;
  }
};

type ThriftContextProviderProps = {
  children: React.ReactNode;
};

export const ThriftContextProvider: React.FC<ThriftContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(thriftReducer, initialState);

  return (
    <ThriftContext.Provider value={{ state, dispatch }}>
      {children}
    </ThriftContext.Provider>
  );
};

// Create a custom hook to use the ThriftContext
export const useThriftContext = () => {
  const context = useContext(ThriftContext);

  if (context === undefined) {
    throw new Error(
      "useThriftContext must be used within a ThriftContextProvider"
    );
  }

  return context;
};
