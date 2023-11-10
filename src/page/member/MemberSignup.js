import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");

  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  const toast = useToast();

  let submitAvailable = true;

  if (!emailAvailable) {
    submitAvailable = false;
  }

  if (!idAvailable) {
    submitAvailable = false;
  }

  if (password != passwordCheck) {
    submitAvailable = false;
  }

  if (password.length === 0) {
    submitAvailable = false;
  }

  function handleSubmit() {
    axios
      .post("/api/member/signup", { id, password, email })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  function handleIdCheck() {
    // encoding 대신해주는 코드 ------->    URLSearchparams
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    // 중복검사는 then 과 catch가 반대결과~
    axios
      .get("/api/member/check?" + searchParam.toString())
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "이미 사용중인 ID입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        // 404에러 일때만 true로 처리 (값이 없어야 중복아니기 때문에)
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "사용 가능한 ID입니다.",
            status: "success",
          });
        }
      })
      .finally(() => console.log("끝"));
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
      <h1>회원 가입</h1>
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          <Button onClick={handleIdCheck}>중복확인</Button>
        </Flex>
        <FormErrorMessage>중복체크를 해주세요.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password.length === 0}>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormErrorMessage>암호를 입력해주세요.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password != passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!emailAvailable}>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmailAvailable(false);
              setEmail(e.target.value);
            }}
          />
          <Button onClick={handleEmailCheck}>중복체크</Button>
        </Flex>
        <FormErrorMessage>email 중복 체크를 해주세요.</FormErrorMessage>
      </FormControl>

      <Button
        isDisabled={!submitAvailable}
        onClick={handleSubmit}
        colorScheme="blue"
      >
        가입
      </Button>
    </Box>
  );
}
