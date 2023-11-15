import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Input,
  Stack,
  StackDivider,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      // 어느 게시물에서(boardview에서 prop으로 받아옴
      boardId,
      // 어떤 댓글
      comment,
    });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList({ boardId }) {
  // 댓글이 없는경우, 첫값이 null일때 오류나서 []로
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", boardId);

    axios
      .get("/api/comment/list?" + params)
      .then((response) => setCommentList(response.data));
  }, []);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <Box>
              <Flex justifyContent="space-between">
                <Heading size="xs">{comment.memberId}</Heading>
                <Text fontsize="xs">{comment.inserted}</Text>
              </Flex>
              <Text pt="2" fontsiz="sm">
                {comment.comment}
              </Text>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
