import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  createCookieSessionStorage,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  if (email === "valid@email.com" && password === "valid_password") {
    const storage = createCookieSessionStorage({
      cookie: {
        name: "diaro-de-trabajo-session",
      },
    });

    const session = await storage.getSession();
    session.set("isAdmin", true);

    return new Response("", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  }

  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const storage = createCookieSessionStorage({
    cookie: {
      name: "diaro-de-trabajo-session",
    },
  });
  const session = await storage.getSession(request.headers.get("cookie"));

  return session.data;
}

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="mt-8">
      {data?.isAdmin ? (
        <p>You&apos;re signed in!</p>
      ) : (
        <Form method="post">
          <input
            className="text-gray-900"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="text-gray-900"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button className="bg-blue-500 px-3 py-2 font-medium text-white">
            Log in
          </button>
        </Form>
      )}
    </div>
  );
}
