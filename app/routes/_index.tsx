import {
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";

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
  const formData = await request.formData();
  const json = Object.fromEntries(formData);
  console.log("[from action function]:", { json });

  return redirect("/");
}

export default function Index() {
  return (
    <div className="p-20">
      <h1 className="text-5xl">Diaro de Trabajo</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>

      <div className="my-8 border p-2">
        <Form method="post">
          <p className="italic">Create an entry.</p>

          {/* category */}
          <div>
            <div className="mt-4">
              <input type="date" name="date" className="text-gray-700" />
            </div>

            <div className="mt-4 space-x-6">
              <label>
                <input
                  className="mr-1"
                  type="radio"
                  name="category"
                  value="work"
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
                name="text"
                className="w-full text-gray-700"
                placeholder="Write your entry..."
              />
            </div>

            {/* submit button */}
            <div className="mt-1 text-right">
              <button
                className="bg-blue-500 px-4 py-1 font-medium text-white "
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </Form>
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
