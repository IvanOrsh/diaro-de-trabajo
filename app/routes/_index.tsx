import type { MetaFunction } from "@remix-run/node";

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

export default function Index() {
  return (
    <div className="p-20">
      <h1 className="text-5xl">Diaro de Trabajo</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>

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
