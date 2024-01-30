// import React, {createContext, useContext, useReducer, useEffect, Children} from "react";

// const AuthContext = createContext()

// const initialState = {
//   user: { id: null, first_name: null, email: null, password: null, community_id: null, is_logged_in: false },
//   mode : 'dark',
//   messages: [], 
//   //sockets
//   active_socket : null,
//   active_conns : null,
//   //notifications
//   notifications: [],
//   display_notification: {"content": ""},
//   notifykaro : false
// };

// const authContextReducer = (state, action) => {
//   //handle actions
// }

// const AuthContextProvider = ({children}) => {
//   const [state, dispatch] = useReducer(authContextReducer, initialState);
//   return <AuthContext.Provider value={{...state}}>
//     {children}
//   </AuthContext.Provider>
// }

// const useAuthData = () => {useContext(AuthContext)}
// export {AuthContextProvider, useAuthData}