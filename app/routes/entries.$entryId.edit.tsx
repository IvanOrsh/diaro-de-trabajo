import { PrismaClient } from "@prisma/client";
import {
  ActionFunctionArgs,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EntryForm from "~/components/entry-form";

export async function action({ request, params }: ActionFunctionArgs) {
  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404 });
  }

  // TODO: extract to data layer
  const db = new PrismaClient();

  const formData = await request.formData();
  // TODO: validate (zod?)
  const { date, category, text } = Object.fromEntries(formData);

  // TODO: remove delay
  await new Promise((r) => setTimeout(r, 1000));

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

  return redirect("/");
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404 });
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

  return {
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  };
}

export default function EditPage() {
  const entry = useLoaderData<typeof loader>();
  return (
    <div className="mt-4">
      <h1>Editing entry: {entry.id}</h1>

      <div className="mt-8">
        <EntryForm entry={entry} />
      </div>
    </div>
  );
}
