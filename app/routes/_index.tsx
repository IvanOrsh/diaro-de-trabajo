import { PrismaClient } from "@prisma/client";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO, startOfWeek } from "date-fns";

import EntryForm from "~/components/entry-form";
import { getSession } from "~/session";

export const meta: MetaFunction = () => {
  return [
    { title: "Diaro de Trabajo" },
    {
      name: "description",
      content:
        "The app is a working journal that will help you to track your daily work and/or learning activities!",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  // protect the action from unauthorized access
  const session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
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

  return await db.entry.create({
    data: {
      date: new Date(date),
      type: category,
      text: text,
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  const db = new PrismaClient();
  const entries = await db.entry.findMany({
    orderBy: {
      date: "desc",
    },
  });

  return {
    session: session.data,
    entries: entries.map((entry) => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10),
    })),
  };
}

export default function Index() {
  const { session, entries } = useLoaderData<typeof loader>();

  const entriesByWeek = entries.reduce<Record<string, typeof entries>>(
    (acc, curEntry) => {
      const sunday = startOfWeek(parseISO(curEntry.date));
      const sundayStr = format(sunday, "yyyy-MM-dd");

      acc[sundayStr] ||= [];
      acc[sundayStr].push(curEntry);

      return acc;
    },
    {}
  );
  const weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b)) // array of date strings
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter((entry) => entry.type === "work"),
      learnings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "learning"
      ),
      interestingThings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "interesting-thing"
      ),
    }));

  return (
    <>
      {session.isAdmin && (
        <div className="my-8 border p-2">
          <p className="italic">Create an entry.</p>
          <EntryForm />
        </div>
      )}

      <div className="mt-12 space-y-16">
        {weeks.map((week) => (
          <div key={week.dateString} className="mt-6">
            <p className="font-bold">
              Week of {format(parseISO(week.dateString), "MMM, do, yyyy")}
            </p>

            <div className="mt-3 space-y-4">
              {week.work.length > 0 && (
                <div>
                  <p>Work</p>
                  <ul className="list-disc pl-8">
                    {week.work.map((entry) => (
                      <EntryListItem
                        key={entry.id}
                        entry={entry}
                        canEdit={session.isAdmin}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {week.learnings.length > 0 && (
                <div>
                  <p>Learnings</p>
                  <ul className="list-disc pl-8">
                    {week.learnings.map((entry) => (
                      <EntryListItem
                        key={entry.id}
                        entry={entry}
                        canEdit={session.isAdmin}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {week.interestingThings.length > 0 && (
                <div>
                  <p>Interesting things</p>
                  <ul className="list-disc pl-8">
                    {week.interestingThings.map((entry) => (
                      <EntryListItem
                        key={entry.id}
                        entry={entry}
                        canEdit={session.isAdmin}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EntryListItem({
  entry,
  canEdit,
}: {
  entry: Awaited<ReturnType<typeof loader>>["entries"][number];
  canEdit: boolean;
}) {
  return (
    <li className="group" key={entry.id}>
      {entry.text}
      {canEdit && (
        <Link
          to={`/entries/${entry.id}/edit`}
          className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
        >
          Edit
        </Link>
      )}
    </li>
  );
}
