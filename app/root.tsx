import {
  LoaderFunctionArgs,
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { destroySession, getSession } from "./session";
import stylesheet from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: "/fonts/inter/inter.css" },
];

export const meta: MetaFunction = () => {
  return [{ title: "diaro-de-trabajo" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  return { session: session.data };
}

export default function App() {
  const { session } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="p-4">
          <header>
            <div className="flex justify-between text-sm">
              <p className="uppercase">
                <span className="text-gray-500">Ivan</span>
                <span className="font-semibold text-gray-200">Orsh</span>
              </p>

              <div className="text-gray-500">
                {session.isAdmin ? (
                  <Form method="post">
                    <button>Logout</button>
                  </Form>
                ) : (
                  <Link to="/login">Log in</Link>
                )}
              </div>
            </div>

            <div className="mb-20 mt-16">
              <div className="text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-white">
                  <Link to="/">Diaro de Trabajo</Link>
                </h1>
                <p className="mt-2 tracking-tighter text-gray-500">
                  Doings and learnings. Updated weekly.
                </p>
              </div>
            </div>
          </header>

          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oh no!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center">
        <p className="text-3xl">Whoops!</p>

        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} ~ {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <p>{error.message}</p>
        ) : (
          <p>Unexpected error</p>
        )}

        <Scripts />
      </body>
    </html>
  );
}
