import { PrismaClient } from "@prisma/client";
import {
  ActionFunctionArgs,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import EntryForm from "~/components/entry-form";
import { getSession } from "~/session";

export async function action({ request, params }: ActionFunctionArgs) {
  // protect the action from unauthorized access
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404, statusText: "Not found" });
  }

  const db = new PrismaClient();
  const formData = await request.formData();

  const { date, category, text, _action } = Object.fromEntries(formData);

  await new Promise((r) => setTimeout(r, 1000));

  if (_action === "delete") {
    await db.entry.delete({
      where: {
        id: +params.entryId,
      },
    });
  } else {
    if (
      typeof date !== "string" ||
      typeof category !== "string" ||
      typeof text !== "string"
    ) {
      throw new Error("Bad request");
    }

    await db.entry.update({
      where: {
        id: +params.entryId,
      },
      data: {
        date: new Date(date),
        type: category,
        text: text,
      },
    });
  }

  return redirect("/");
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (typeof params.entryId !== "string" || isNaN(+params.entryId!)) {
    throw new Response("Not found", { status: 404, statusText: "Not found" });
  }

  const db = new PrismaClient();
  const entry = await db.entry.findUnique({
    where: {
      id: +params.entryId,
    },
  });

  if (!entry) {
    throw new Response("Not found", { status: 404 });
  }

  // is this user is logged in (admin)?
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  return {
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  };
}

export default function EditPage() {
  const entry = useLoaderData<typeof loader>();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!confirm("Are your sure?")) {
      event.preventDefault();
      console.log("yes");
    }
  }

  return (
    <div className="mt-4">
      <div className="mb-8 rounded-lg border border-gray-700/30 bg-gray-800/50 p-4 lg:mb-20 lg:p-6">
        <p className="text-sm font-medium text-gray-500 lg:text-base">
          Edit entry
        </p>

        <EntryForm entry={entry} />
      </div>

      <div className="mt-8">
        <Form method="post" onSubmit={handleSubmit}>
          <button
            name="_action"
            value="delete"
            className="text-sm text-gray-600 underline"
          >
            Delete this entry...
          </button>
        </Form>
      </div>
    </div>
  );
}
