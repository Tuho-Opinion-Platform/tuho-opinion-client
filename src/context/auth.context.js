import React, { useEffect, useState } from "react";
import axios from "axios";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {

  const API_URL = process.env.REACT_APP_SERVER_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  }

  const authenticateUser = () => {
    const storedToken = localStorage.getItem("authToken");

    if(storedToken) {
      axios.get(`${API_URL}/auth/verify`, {headers: {Authorization: `Bearer ${storedToken}`}})
        .then(response => {
          const user = response.data;

          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(user);
        })
        .catch(error => {
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        })
    } else {
      // if the token is not available or is removed
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    };
  };
  
    const logOutUser = () => {
      removeToken();
      authenticateUser();
    };

  const removeToken = () => {
    localStorage.removeItem("authToken")
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return(
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser
      }}
    >
    {props.children}
    </AuthContext.Provider>
  );

};

export {AuthProviderWrapper, AuthContext};