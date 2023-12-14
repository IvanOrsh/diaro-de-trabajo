import { useFetcher } from "@remix-run/react";
import { useRef } from "react";

export default function EntryForm({
  entry,
}: {
  entry: { date: string; type: string; text: string };
}) {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
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
              defaultValue={entry.date}
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
                defaultChecked={entry.type === "work"}
              />
              Work
            </label>
            <label>
              <input
                className="mr-1"
                type="radio"
                name="category"
                value="learning"
                defaultChecked={entry.type === "learning"}
              />
              Learning
            </label>
            <label>
              <input
                className="mr-1"
                type="radio"
                name="category"
                value="interesting-thing"
                defaultChecked={entry.type === "interesting-thing"}
              />
              Interesting things
            </label>
          </div>
          {/* text field */}
          <div className="mt-4">
            <textarea
              ref={textAreaRef}
              name="text"
              className="w-full text-gray-700"
              placeholder="Write your entry..."
              required
              defaultValue={entry.text}
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
  );
}
