import {createContext, useState} from "react";

const defaultUser = null;
const user = defaultUser;
const setUser = () => {};

export function UserProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      { children }
    </UserContext.Provider>
  )
}

export const UserContext = createContext({ user, setUser });
