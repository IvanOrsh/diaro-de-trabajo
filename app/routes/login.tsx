import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { commitSession, getSession } from "~/session";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  if (email === "valid@email.com" && password === "valid_password") {
    const session = await getSession();

    session.set("isAdmin", true);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  let error;
  if (!email) {
    error = "Email is required.";
  } else if (!password) {
    error = "Password is required.";
  } else {
    error = "Invalid login.";
  }

  return json(
    {
      error,
    },
    401
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  return session.data;
}

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="mx-auto mt-8 max-w-xs lg:max-w-sm">
      {data?.isAdmin ? (
        <p>You&apos;re signed in!</p>
      ) : (
        <Form method="post">
          <div className="space-y-2">
            <input
              className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
              type="email"
              name="email"
              placeholder="Email"
              required
              style={{
                colorScheme: "dark",
              }}
            />
            <input
              className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
              type="password"
              name="password"
              placeholder="Password"
              required
              style={{
                colorScheme: "dark",
              }}
            />
          </div>

          <div className="mt-8">
            <button className="w-full rounded-md bg-sky-600 px-3 py-2 font-medium text-white transition-all duration-150 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900">
              Log in
            </button>
          </div>

          {actionData?.error && (
            <p className="mt-4 font-medium text-red-400">{actionData.error}</p>
          )}
        </Form>
      )}
    </div>
  );
}
