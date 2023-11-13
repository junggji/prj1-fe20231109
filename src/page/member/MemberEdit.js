import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";

export function MemberEdit() {
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(false);

  const toast = useToast();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((response) => {
      setMember(response.data);
      setEmail(response.data.email);
    });
  }, []);

  const id = params.get("id");

  // 기존 이메일과 같은지?
  let sameOriginEmail = false;

  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  // 기존 이메일과 같거나, 중복확인을 했거나 하면, 비활성화
  let emailChecked = sameOriginEmail || emailAvailable;

  if (member === null) {
    return <Spinner />;
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        setEmailAvailable(true);
        if (error.response.status == 404) {
          toast({
            description: "사용가능한 email입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" />
      </FormControl>

      {/* email을 변경하면(작성시작) 중복확인 다시 하도록 */}
      {/* 기존 email과 같으면 중복확인 안해도됨 */}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              //  중복확인 하고 다시 입력하면 중복확인 활성화되게 setEmailAvailable를 false로
              setEmailAvailable(false);
              setEmail(e.target.value);
            }}
          />
          <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>
    </Box>
  );
}
