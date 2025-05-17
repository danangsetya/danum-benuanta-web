import LoginForm from "@/components/pages/login";
import { authOptions } from "@/lib/auth";
import { hidden } from "@/redux/features/menuStatusSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession(authOptions);
  console.log("session->", session);
  if (session) redirect("/");
  return (
    <section className="bg-green-600 min-h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-yellow-400 text-[3rem] text-center md:text-left   font-bold mx-2">
        DANUM BENUANTA
        <span className="font-thin text-slate-50 text-[10px] align-super">
          1.0.0
        </span>
      </h1>
      <h1 className="text-slate-50 text-[1.5rem] font-bold">LOGIN</h1>
      <LoginForm />
    </section>
  );
}
