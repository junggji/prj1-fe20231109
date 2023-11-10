import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);

  const navigate = useNavigate();

  // /edit/:id
  const { id } = useParams(); // 구조변경할당 {}

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  // board null값 나오면 오류나는거 처리 -----
  if (board === null) {
    return <Spinner />;
  }

  function handleSubmit() {
    // 저장 버튼 클릭 시
    // PUT /api/board/edit (전송 방식종류 : GET POST DELETE PUT PATCH HEAD ...)
    axios
      .put("/api/board/edit", board)
      .then(() => console.log("잘됨"))
      .catch(() => console.log("잘안됨"))
      .finally(() => console.log("끝"));
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.content = e.target.value;
            })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.writer = e.target.value;
            });
          }}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        저장
      </Button>
      {/* navigate(-1) ---> 이전경로로 이동 (+1)은 앞으로 이동 */}
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}
