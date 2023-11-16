import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Stack,
  StackDivider,
  Textarea,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteIcon, EditIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";

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

function CommentItem({ comment, onDeleteModalOpen }) {
  const { hasAccess } = useContext(LoginContext);

  // 수정중인지 아닌지 상태
  const [isEditing, setIsEditing] = useState(false);
  // 수정글의 상태 --> 초기값 : 원본글
  const [commentEdited, setCommentEdited] = useState(comment.comment);

  function handleSubmit() {
    axios
      .put("/api/comment/edit", { id: comment.id, comment: commentEdited })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="xs">{comment.memberId}</Heading>
        <Text fontSize="xs">{comment.inserted}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        {/* 새로운 줄 출력 */}
        <Box flex={1}>
          <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
            {comment.comment}
          </Text>
          {isEditing && (
            <Box>
              <Textarea
                value={commentEdited}
                onChange={(e) => setCommentEdited(e.target.value)}
              />
              <Button colorScheme="blue" onClick={handleSubmit}>
                저장
              </Button>
            </Box>
          )}
        </Box>

        {hasAccess(comment.memberId) && (
          <Box>
            {/* 수정버튼, 취소버튼누르면 isEditing 상태변경을 통해 TextArea 보이게 안보이게 */}
            {isEditing || (
              <Button
                size="xs"
                colorScheme="purple"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
              </Button>
            )}
            {isEditing && (
              <Button
                size="xs"
                colorScheme="gray"
                onClick={() => setIsEditing(false)}
              >
                <NotAllowedIcon />
              </Button>
            )}
            <Button
              onClick={() => onDeleteModalOpen(comment.id)}
              size="xs"
              colorScheme="red"
            >
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

function CommentList({ commentList, onDeleteModalOpen, isSubmitting }) {
  // 로그인 했는지와 권한있는지를 LoginProvider에서 context로 받음
  const { hasAccess } = useContext(LoginContext);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDeleteModalOpen={onDeleteModalOpen}
            />
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
  // generate destructuring ~

  const { isOpen, onClose, onOpen } = useDisclosure();

  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
  //  --> 랜더링에 영향을 미치지 않는 값일때 쓴다.
  // useState와 차이점은 퍼포먼스(성능)에 약간의 차이를 준다. 거의 상관이 없다.
  // 안쓸때: 랜더링하는 코드 안에서,
  // 사용: Effect함수 안에서 변경시키거나 읽을때, EventHandle메소드 안에서 변경/읽을 때

  // const [id, setId] = useState(0);
  const commentIdRef = useRef(0);

  const { isAuthenticated } = useContext(LoginContext);

  const toast = useToast();

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
      .then(() => {
        toast({
          description: "댓글이 등록되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        toast({
          description: "댓글 등록 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete() {
    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제 중 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        onClose();
        setIsSubmitting(false);
      });
  }

  function handleDeleteModalOpen(id) {
    // id를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;

    // 모달 열기
    onOpen();
  }

  return (
    <Box>
      {/* 로그인 안하면 댓글form 안보이게 */}
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      {/*  삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
