import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

export default function EntryForm({
  entry,
}: {
  entry?: { date: string; type: string; text: string };
}) {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // clear & focus
  useEffect(() => {
    const isInit = fetcher.state === "idle" && fetcher.data == null;
    if (!isInit && fetcher.state === "idle" && textAreaRef.current) {
      textAreaRef.current.value = "";
      textAreaRef.current.focus();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="mt-4">
      <fieldset
        className="disabled:opacity-70"
        disabled={fetcher.state !== "idle"}
      >
        <div>
          {/* date & radio group */}
          <div className="lg:flex lg:items-center lg:justify-between">
            {/* date */}
            <div className="lg:order-2">
              <input
                defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
                type="date"
                name="date"
                className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
                style={{ colorScheme: "dark" }}
                required
              />
            </div>
            {/* radio group: category */}
            <div className="mt-6 flex space-x-4 text-sm lg:mt-0 lg:space-x-6 lg:text-base">
              {[
                {
                  label: "Work",
                  value: "work",
                },
                {
                  label: "Learning",
                  value: "learning",
                },
                {
                  label: "Interesting things",
                  value: "interesting-thing",
                },
              ].map(({ label, value }) => (
                <label key={value} className="inline-block text-white">
                  <input
                    className="mr-2 border-gray-700 bg-gray-800 text-sky-600 focus:ring-sky-600 focus:ring-offset-gray-900"
                    type="radio"
                    name="category"
                    value={value}
                    required
                    defaultChecked={value === (entry?.type ?? "work")}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* text field */}
          <div className="mt-6">
            <textarea
              ref={textAreaRef}
              name="text"
              className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
              rows={3}
              placeholder="Write your entry..."
              required
              defaultValue={entry?.text ?? ""}
            />
          </div>

          {/* submit button */}
          <div className="mt-6 text-right">
            <button
              className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-100 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900 lg:w-auto lg:py-1.5"
              type="submit"
            >
              {fetcher.state !== "idle" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
