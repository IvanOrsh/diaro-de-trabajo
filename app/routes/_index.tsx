import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { PrismaClient } from "@prisma/client";

import { format } from "date-fns";

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

export default function Index() {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // clear & focus
  useEffect(() => {
    if (fetcher.state === "idle" && textAreaRef.current) {
      textAreaRef.current.value = "";
      textAreaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div className="p-20">
      <h1 className="text-5xl">Diaro de Trabajo</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>

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
                    value="Interesting-thing"
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

      <div className="mt-4">
        <p className="font-bold">
          Week of December 14<sup>th</sup>, 2023
        </p>

        <div className="mt-3 space-y-4">
          {/* work */}
          <div>
            <p>Work</p>
            <ul className="list-disc pl-8">
              <li>First Item</li>
              <li>Second Item</li>
              <li>Third Item</li>
            </ul>
          </div>

          <div>
            <p>Learnings</p>
            <ul className="list-disc pl-8">
              <li>First Item</li>
              <li>Second Item</li>
              <li>Third Item</li>
            </ul>
          </div>

          <div>
            <p>Interesting things</p>
            <ul className="list-disc pl-8">
              <li>First Item</li>
              <li>Second Item</li>
              <li>Third Item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
