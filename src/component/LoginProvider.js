import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LoginContext = createContext(null);
function LoginProvider({ children }) {
  const [login, setLogin] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  console.log(login);

  function fetchLogin() {
    axios.get("/api/member/login").then((response) => setLogin(response.data));
  }

  function isAuthenticated() {
    return login !== "";
  }

  // js array 의 some 메소드 --> 하나라도 일치하는지 테스트 (admin인지 확인)
  function isAdmin() {
    if (login.auth) {
      // some 은 list에만 있는 메소드여서, 처음 실행시에 login이 null이면 list가 아니여서 some값이 undefined오류가 나서 넣은 코드
      return login.auth.some((elem) => elem.name === "admin");
    }
    return false;
  }

  function hasAccess(userId) {
    return login.id === userId;
  }

  return (
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess, isAdmin }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
