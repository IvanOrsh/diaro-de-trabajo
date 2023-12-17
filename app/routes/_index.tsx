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
  const weeks = Object.keys(entriesByWeek).map((dateString) => ({
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
        <div className="my-8 rounded-lg border border-gray-700/30 bg-gray-800/50 p-4">
          <p className="text-sm font-medium text-gray-500">New entry</p>
          <EntryForm />
        </div>
      )}

      <div className="mt-12 space-y-12 border-l-2 border-sky-500/[.25] pl-5">
        {weeks.map((week) => (
          <div key={week.dateString} className="relative">
            {/* circle */}
            <div className="absolute left-[-30px] rounded-full bg-gray-900 p-1">
              <div className="h-[10px] w-[10px] rounded-full border border-sky-500 bg-gray-900"></div>
            </div>

            <p className="pt-[1px] text-xs font-semibold uppercase tracking-wider text-sky-500">
              {format(parseISO(week.dateString), "MMM d, yyyy")}
            </p>

            <div className="mt-6 space-y-4">
              <EntryList entries={week?.work} label="work" />

              <EntryList entries={week?.learnings} label="learnings" />

              <EntryList
                entries={week?.interestingThings}
                label="interesting things"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EntryList({
  entries,
  label,
}: {
  entries: Awaited<ReturnType<typeof loader>>["entries"];
  label: "work" | "learnings" | "interesting things";
}) {
  if (entries?.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="font-semibold capitalize text-white">{label}</p>
      <ul className="mt-6 space-y-6">
        {entries.map((entry) => (
          <EntryListItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </div>
  );
}

function EntryListItem({
  entry,
}: {
  entry: Awaited<ReturnType<typeof loader>>["entries"][number];
}) {
  const { session } = useLoaderData<typeof loader>();

  return (
    <li className="group leading-7" key={entry.id}>
      {entry.text}
      {session.isAdmin && (
        <Link
          to={`/entries/${entry.id}/edit`}
          className="ml-2 text-sky-500 opacity-0 group-hover:opacity-100"
        >
          Edit
        </Link>
      )}
    </li>
  );
}
