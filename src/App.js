import React, { createContext, useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BoardWrite } from "./page/board/BoardWrite";
import { BoardList } from "./page/board/BoardList";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardView } from "./page/board/BoardView";
import { BoardEdit } from "./page/board/BoardEdit";
import { MemberSignup } from "./page/member/MemberSignup";
import { MemberList } from "./page/member/MemberList";
import { MemberView } from "./page/member/MemberView";
import { MemberEdit } from "./page/member/MemberEdit";
import { MemberLogin } from "./page/member/MemberLogin";
import axios from "axios";

// homelayout -> 전체 틀 (navigation bar)
const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      <Route path="board/:id" element={<BoardView />} />
      <Route path="edit/:id" element={<BoardEdit />} />
      <Route path="signup" element={<MemberSignup />} />
      <Route path="member/list" element={<MemberList />} />
      <Route path="member" element={<MemberView />} />
      <Route path="member/edit" element={<MemberEdit />} />
      <Route path="login" element={<MemberLogin />} />
    </Route>,
  ),
);

export const LoginContext = createContext(null);

function App(props) {
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
      <RouterProvider router={routes} />
    </LoginContext.Provider>
  );
}

export default App;
