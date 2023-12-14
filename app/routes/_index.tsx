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
      <p className="text-blue-500">Does tailwindcss really work?</p>

      <ul className="flex flex-col p-2">
        <li className="bg-blue-500 p-2">first</li>
        <li className="mt-10 bg-red-500 p-2 ">second</li>
      </ul>
    </div>
  );
}
