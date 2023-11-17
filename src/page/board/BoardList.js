import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  // useEffect 두번째 파라미터 인자로 params 대신에 location을 넣음(api추천)
  const location = useLocation();

  // 페이지 처음 로딩
  useEffect(() => {
    axios.get("/api/board/list?" + params).then((response) => {
      setBoardList(response.data.boardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>
                <FontAwesomeIcon icon={faHeart} />
              </Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList &&
              boardList.map((board) => (
                <Tr
                  _hover={{
                    cursor: "pointer",
                  }}
                  key={board.id}
                  onClick={() => navigate("/board/" + board.id)}
                >
                  <Td>{board.id}</Td>
                  <Td>{board.countLike != 0 && board.countLike}</Td>
                  <Td>
                    {board.title}
                    {board.countComment > 0 && (
                      <Badge>
                        <ChatIcon />
                        {board.countComment}
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.nickName}</Td>
                  <Td>{board.ago}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        <Box>
          <Button value={1} onClick={() => navigate("/?p=1")}>
            1
          </Button>
          <Button value={2} onClick={() => navigate("/?p=2")}>
            2
          </Button>
          <Button value={3} onClick={() => navigate("/?p=3")}>
            3
          </Button>
          <Button value={4} onClick={() => navigate("/?p=4")}>
            4
          </Button>
          <Button value={5} onClick={() => navigate("/?p=5")}>
            5
          </Button>
          <Button value={6} onClick={() => navigate("/?p=6")}>
            6
          </Button>
          <Button value={7} onClick={() => navigate("/?p=7")}>
            7
          </Button>
          <Button value={8} onClick={() => navigate("/?p=8")}>
            8
          </Button>
          <Button value={9} onClick={() => navigate("/?p=9")}>
            9
          </Button>
          <Button value={10} onClick={() => navigate("/?p=10")}>
            10
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
