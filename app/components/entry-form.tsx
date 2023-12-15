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

  console.log(fetcher.state);

  return (
    <fetcher.Form method="post">
      <fieldset
        className="disabled:opacity-70"
        disabled={fetcher.state !== "idle"}
      >
        <div>
          {/* Date */}
          <div className="mt-4">
            <input
              defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
              type="date"
              name="date"
              className="text-gray-700"
            />
          </div>
          <div className="mt-4 space-x-4">
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
              <label key={value}>
                <input
                  className="mr-1"
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
          <div className="mt-4">
            <textarea
              ref={textAreaRef}
              name="text"
              className="w-full text-gray-700"
              placeholder="Write your entry..."
              required
              defaultValue={entry?.text ?? ""}
            />
          </div>
          {/* submit button */}
          <div className="mt-1 text-right">
            <button
              className="bg-blue-500 px-4 py-1 font-medium text-white "
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
