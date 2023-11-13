import { useSearchParams } from "react-router-dom";

export function MemberView() {
  // /member?id=userid
  // 넘어온 param을 받는 코드
  const [params] = useSearchParams();

  return <div>{params.get("id")}님 회원 정보 보기</div>;
}
