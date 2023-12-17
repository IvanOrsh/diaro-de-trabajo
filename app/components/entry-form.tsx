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
          <div className="space-y-6">
            {/* date */}
            <div>
              <input
                defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
                type="date"
                name="date"
                className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
                style={{ colorScheme: "dark" }}
                required
              />
            </div>

            {/* category */}
            <div className="flex space-x-4 text-sm">
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

            {/* text field */}
            <div>
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
          </div>

          {/* submit button */}
          <div className="mt-6 text-right">
            <button
              className="w-full rounded-md bg-sky-600 px-3 py-2 font-medium text-white transition-colors duration-100 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900"
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
