import HomePage from "@/components/layout/homepage";
import { auth } from "@/auth";

export default function Home() {
  // const session = await auth();
  // console.log("check session ", session);
  return (
    <div>
      {/* <div>{JSON.stringify(session)}</div> */}
      <HomePage />
    </div>
  );
}
