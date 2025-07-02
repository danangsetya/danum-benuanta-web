import { NextAuthOptions, User } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare, genSalt, hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { SERVER_PHP } from "./utils";
const handleRespon = (user: string, userData: any) => {
  return new Promise<User>(async (resolve, rej) => {
    const dataGroupUser = await prisma.auth_groups_users.findFirst({
      where: {
        user_id: userData.id,
      },
    });
    if (dataGroupUser) {
      const dataPermissions =
        await prisma.$queryRaw`SELECT benuanta_pegawai.auth_permissions.* FROM benuanta_pegawai.auth_groups_permissions,benuanta_pegawai.auth_permissions WHERE benuanta_pegawai.auth_groups_permissions.group_id=${dataGroupUser.group_id} AND benuanta_pegawai.auth_groups_permissions.permission_id=benuanta_pegawai.auth_permissions.id`;
      const dataPersonalia = await prisma.personalia.findFirst({
        where: {
          id: userData.id_personalia,
        },
      });
      if (dataPersonalia) {
        const dataUser = await prisma.users.findFirst({
          where: {
            id: dataPersonalia.id,
          },
        });
        console.log("dataPermissions->", dataPermissions);
        const dataPermToJson = JSON.parse(
          JSON.stringify(dataPermissions, (_, value) =>
            typeof value == "bigint" ? value.toString() : value
          )
        );
        resolve({
          id: userData?.id.toString(),
          name: user,
          email: JSON.stringify({
            permissions: dataPermToJson,
            profil: {
              nama: dataPersonalia?.nama,
              nik: dataPersonalia?.nik,
              email: dataPersonalia?.email,
              status_pegawai: dataPersonalia?.status_pegawai,
              gol: dataPersonalia?.gol,
              unit_kerja: dataPersonalia?.unit_kerja,
              jabatan: dataPersonalia?.jabatan,
              bagian: dataPersonalia?.bagian,
              pangkat: dataPersonalia?.pangkat,
              uname: dataPersonalia?.username,
              hash: dataUser?.activate_hash,
              id_mesin_absen: dataPersonalia.id_mesin_absen,
            },
          }),
        } as User);
      }

      // const
    }
  });
};
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialProvider({
      id: "login",
      name: "Login",
      // type: "credentials",
      credentials: {
        user: {
          label: "User Name",
          type: "text",
          placeholder: "Masukkan Username",
        },
        pass: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // console.log("credensial->", credentials);
        // return {
        //   id: "1",
        //   name: "user",
        //   email: "sawadikap@gmail.com",
        // } as User;
        const { user, pass } = credentials as {
          user: string;
          pass: string;
        };
        if (!credentials?.pass || !credentials.user) return null;
        // console.log("fuck");
        // const tes = await prisma.users.findMany({
        //   where: {
        //     username: "danang",
        //   },
        // });
        // prisma.users
        //   .findMany({
        //     where: {
        //       username: "danang",
        //     },
        //   })
        //   .then((res) => console.log(res))
        //   .catch((err) => console.error(err));
        // console.log(tes);
        const userData = await prisma.users.findUnique({
          where: {
            username: user,
          },
        });
        // console.log("fuck");
        // console.log("data user", userData);
        const salt = await genSalt(10);
        // const cekPass = await compare(pass, userData!.password_hash);
        // console.log("userData->", userData?.password_hash);
        // console.log("userData->", pass);
        // console.log("userData->", cekPass);
        // console.log("userData->hash", await hash(pass, salt));
        //$2y$10$CX65gLfeZibeoYyOZB1KwO9fqDZ2UKzNnBekNqB5GdQDvlXePbrQm
        //$2a$04$0y202a0Nv6oQTQjM6PexjOLeQ4JiULi4dqzRbmb0bOrqxTpXqmTfu generate by bcryptjs hash
        // return {
        //   name: user,
        //   email: "sawadikap@gmail.com",
        // } as User;
        // if (userData) {
        //   const result = await compare(pass, userData.password_hash);
        //   console.log("compare->", result);
        // }

        if (!credentials?.pass || !credentials.user) return null;
        // const test_hash = userData?.password_hash.replace("$2y", "$2a");
        // console.log("credentialx", await compare(pass, test_hash as string));
        //!userData ||
        if (userData) {
          if (await compare(pass, userData.password_hash)) {
            return handleRespon(user, userData);
          } else {
            const formData = new FormData();
            formData.append("me", pass);
            formData.append("you", userData?.password_hash as string);
            // console.log(userData?.password_hash as string);
            const result = await fetch(SERVER_PHP + "/verify/hash", {
              method: "POST",
              body: formData,
            });
            const res = await result.json();
            // console.log("Result->", res.success);
            if (res.success) {
              return handleRespon(user, userData);
            }
          }
        }

        return null;
        // if (userData && (await compare(pass, userData.password_hash))) {
        //   //user ditemukan

        //   return {
        //     id: userData?.id.toString(),
        //     name: user,
        //     email: user + "@gmail.com",
        //   };
        // }
        // return {
        //   id: "1",
        //   name: user,
        //   email: user + "@gmail.com",
        // } as User;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // console.log("session callback", { session, token });
      return session;
      return {
        ...session,
        x: "yx",
      };
    },
    jwt: ({ token, user }) => {
      // console.log("jwt callback", { token, user });
      // return token;
      return {
        ...token,
      };
    },
  },
};
