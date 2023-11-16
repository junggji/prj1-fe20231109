import { Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightFromBracket,
  faHouse,
  faPen,
  faRightToBracket,
  faUser,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();

  const navigate = useNavigate();

  // 인코딩
  const urlParams = new URLSearchParams();

  // 위치가 바뀌면 실행되는
  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

  // 로그아웃은 따로 이동이 필요한 것이 아니므로 바로 메소드로
  function handleLogout() {
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다.",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    // isAuthenticated는 로그인 여부, isAdmin은 관리자여부
    // 로그인, 관리자 여부에 따라 Navbar가 보여질 수 있게
    <Flex>
      <Button onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHouse} />
        home
      </Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>
          <FontAwesomeIcon icon={faPen} />
          write
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>
          <FontAwesomeIcon icon={faUserPlus} />
          signup
        </Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>
          <FontAwesomeIcon icon={faUsers} />
          회원목록
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member?" + urlParams.toString())}>
          <FontAwesomeIcon icon={faUser} />
          회원정보
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>
          <FontAwesomeIcon icon={faRightToBracket} />
          로그인
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          로그아웃
        </Button>
      )}
    </Flex>
  );
}
