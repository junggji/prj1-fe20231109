import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // 전송상태(전송중이면 클릭못하게)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  //chakra ui의 toast
  const toast = useToast();
  function handleSubmit() {
    // 메소드 시작시(버튼 클릭시) 로딩중 활성화 (저장버튼 비활성화)
    setIsSubmitting(true);
    axios
      .post("/api/board/add", {
        // parameter value로 넘어감
        title,
        content,
      })
      .then(() => {
        toast({
          description: "새 글이 저장되었습니다.",
          status: "success",
        });
        // 끝나면 홈으로 이동****
        navigate("/");
      })
      // badRequest 발생시(blank) 응답 코드
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 400) {
          toast({
            description: "작성한 내용을 확인해주세요.",
            status: "error",
          });
          // 그 외의 오류 발생시 응답 코드
        } else {
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      // 메소드 끝나면 로딩중이 아니게 (저장버튼 다시 활성화 되게)
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Box>
      <h1>게시물 작성</h1>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </FormControl>
        {/* isDisabled : 비활성화 isSubmitting의 상태는 boolean이니까 바로 리턴값으로 넣어주었다 */}
        <Button
          isDisabled={isSubmitting}
          onClick={handleSubmit}
          colorScheme="blue"
        >
          저장
        </Button>
      </Box>
    </Box>
  );
}
