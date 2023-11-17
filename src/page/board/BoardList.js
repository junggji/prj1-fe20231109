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
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pagg, setPagg] = useState(1);

  const [params] = useSearchParams();
  params.set("p", pagg);
  console.log(params.toString());

  const navigate = useNavigate();

  // 페이지 처음 로딩
  useEffect(() => {
    axios
      .get("/api/board/list?p=" + pagg)
      .then((response) => setBoardList(response.data));
  }, [pagg]);

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
        <Flex>
          <Button value={1} onClick={() => setPagg(1)}>
            1
          </Button>
          <Button value={2} onClick={() => setPagg(2)}>
            2
          </Button>
          <Button value={3} onClick={() => setPagg(3)}>
            3
          </Button>
          <Button value={4} onClick={() => setPagg(4)}>
            4
          </Button>
          <Button value={5} onClick={() => setPagg(5)}>
            5
          </Button>
          <Button value={6} onClick={() => setPagg(6)}>
            6
          </Button>
          <Button value={7} onClick={() => setPagg(7)}>
            7
          </Button>
          <Button value={8} onClick={() => setPagg(8)}>
            8
          </Button>
          <Button value={9} onClick={() => setPagg(9)}>
            9
          </Button>
          <Button value={10} onClick={() => setPagg(10)}>
            10
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
