"use client";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { signIn } from "next-auth/react";
export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    user: "",
    pass: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signIn("login", {
        redirect: false,
        user: formValues.user,
        pass: formValues.pass,
        callbackUrl: "/",
      });
      if (!res?.error) {
        router.replace("/");
      } else {
        setError("Username atau Password TIdak Benar");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };
  return (
    <>
      {error && (
        <p className="text-center text-yellow-400 text-sm -mb-3">{error}</p>
      )}
      <form
        method="POST"
        onSubmit={onSubmit}
        className="flex flex-col items-center"
      >
        <input
          type="text"
          name="user"
          className="text-lg border-2 p-2 rounded-lg my-2 w-[300px] "
          placeholder="Username"
          value={formValues.user}
          onChange={handleChange}
        />
        <input
          type="password"
          name="pass"
          className="text-lg border-2 p-2 rounded-lg my-2 w-[300px] "
          placeholder="Password"
          value={formValues.pass}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-[200px] p-3 my-2 bg-yellow-400 rounded-lg font-bold text-xl text-lime-700"
          //   onClick={async () => {
          //     // setLoading(true);
          //     const res = await signIn("login", {
          //       redirect: false,
          //       user: "danang",
          //       pass: "123456",
          //       callbackUrl: "/",
          //     });

          //     console.log(res);
          //     if (res?.url) {
          //       router.replace("/");
          //     }
          //     // setTimeout(() => {
          //     //   router.replace("/");
          //     //   setLoading(false);
          //     // }, 2000);
          //   }}
        >
          {loading ? (
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-lg animate-spin"
            />
          ) : (
            "LOGIN"
          )}
        </button>
      </form>
    </>
  );
}
