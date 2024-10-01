import React, { Dispatch, useReducer } from "react";

type UserType = {
  username: string;
  email: string;
  about: string;
};

// interface NotificationType {
//   room: string;
//   mainUser: string;
// }

interface ThriftState {
  user: UserType | null;
  refresh: boolean;
  //   notifications: NotificationType | null;
  //   currentNotification: NotificationType | null;
}

const initialState: ThriftState = {
  user: null,
  refresh: false,
  // notifications: null,
  // currentNotification: null,
};

type ThriftContextValue = {
  state: ThriftState;
  dispatch: Dispatch<ThriftAction>;
};

type ThriftAction =
  | { type: "addUser"; payload: UserType }
  | { type: "removeUser" }
  | { type: "setRefresh" };
// | { type: "ADD_NOTIFICATION"; payload: NotificationType }
// | { type: "CURRENT_NOTIFICATION"; payload: NotificationType };

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

    // case "ADD_NOTIFICATION":
    //   return {
    //     ...state,
    //     notifications: action.payload,
    //   };

    // case "CURRENT_NOTIFICATION":
    //   return {
    //     ...state,
    //     notifications: null,
    //   };

    default:
      return state;
  }
};
type thriftContextProviderType = {
  children: React.ReactNode;
};
export const ThriftContextProvider: React.FC<thriftContextProviderType> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(thriftReducer, initialState);

  return (
    <ThriftContext.Provider value={{ state, dispatch }}>
      {children}
    </ThriftContext.Provider>
  );
};
