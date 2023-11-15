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
import { DeleteIcon } from "@chakra-ui/icons";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({ commentList }) {
  function handleDelete(id) {
    // TODO: 모달, 삭제후 리스트 업데이트, then, catch, finally
    axios.delete("/api/comment/" + id);
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent="space-between">
                <Heading size="xs">{comment.memberId}</Heading>
                <Text fontSize="xs">{comment.inserted}</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                {/* 새로운 줄 출력 */}
                <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                  {comment.comment}
                </Text>
                <Button
                  onClick={() => handleDelete(comment.id)}
                  size="xs"
                  colorScheme="red"
                >
                  <DeleteIcon />
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 댓글이 없는경우, 첫값이 null일때 오류나서 []로
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios
        .get("/api/comment/list?" + params)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", comment)
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList boardId={boardId} commentList={commentList} />
    </Box>
  );
}
