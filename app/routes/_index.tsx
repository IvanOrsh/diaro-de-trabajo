import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { PrismaClient } from "@prisma/client";

import { format, parseISO, startOfWeek } from "date-fns";

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

export async function loader() {
  const db = new PrismaClient();
  const entries = await db.entry.findMany({
    orderBy: {
      date: "desc",
    },
  });

  return entries.map((entry) => ({
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  }));
}

export default function Index() {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const entries = useLoaderData<typeof loader>();

  // const entriesByWeek = {
  //   "2023-02-11": [entrie2],
  //   "2023-02-18": [entrie1, entrie3],
  // }
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

  // const weeks = [
  //   {
  //     dateString: '2023-02-20',
  //     work: [],
  //     learnings: [],
  //     interestingThngs: [],
  //   },
  //   {
  //     dateString: '2023-02-20',
  //     work: [],
  //     learnings: [],
  //     interestingThngs: [],
  //   }
  // ]
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

  console.log(weeks);

  // clear & focus
  useEffect(() => {
    if (fetcher.state === "idle" && textAreaRef.current) {
      textAreaRef.current.value = "";
      textAreaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <>
      <div className="my-8 border p-2">
        <fetcher.Form method="post">
          <p className="italic">Create an entry.</p>

          <fieldset
            className="disabled:opacity-70"
            disabled={fetcher.state !== "idle"}
          >
            <div>
              {/* Date */}
              <div className="mt-4">
                <input
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                  type="date"
                  name="date"
                  className="text-gray-700"
                />
              </div>
              <div className="mt-4 space-x-6">
                <label>
                  <input
                    className="mr-1"
                    type="radio"
                    name="category"
                    value="work"
                    required
                    defaultChecked
                  />
                  Work
                </label>
                <label>
                  <input
                    className="mr-1"
                    type="radio"
                    name="category"
                    value="learning"
                  />
                  Learning
                </label>
                <label>
                  <input
                    className="mr-1"
                    type="radio"
                    name="category"
                    value="interesting-thing"
                  />
                  Interesting things
                </label>
              </div>
              {/* text field */}
              <div className="mt-2">
                <textarea
                  ref={textAreaRef}
                  name="text"
                  className="w-full text-gray-700"
                  placeholder="Write your entry..."
                  required
                />
              </div>
              {/* submit button */}
              <div className="mt-1 text-right">
                <button
                  className="bg-blue-500 px-4 py-1 font-medium text-white "
                  type="submit"
                >
                  {fetcher.state === "submitting" ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </fieldset>
        </fetcher.Form>
      </div>

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
                      <li key={entry.id}>{entry.text}</li>
                    ))}
                  </ul>
                </div>
              )}

              {week.learnings.length > 0 && (
                <div>
                  <p>Learnings</p>
                  <ul className="list-disc pl-8">
                    {week.learnings.map((entry) => (
                      <li className="group" key={entry.id}>
                        {entry.text}
                        <Link
                          to={`/entries/${entry.id}/edit`}
                          className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
                        >
                          Edit
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {week.interestingThings.length > 0 && (
                <div>
                  <p>Interesting things</p>
                  <ul className="list-disc pl-8">
                    {week.interestingThings.map((entry) => (
                      <li key={entry.id}>{entry.text}</li>
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
