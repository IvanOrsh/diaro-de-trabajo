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
            required
          />
          <input
            className="text-gray-900"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button className="bg-blue-500 px-3 py-2 font-medium text-white">
            Log in
          </button>

          {actionData?.error && (
            <p className="mt-4 font-medium text-red-400">{actionData.error}</p>
          )}
        </Form>
      )}
    </div>
  );
}
