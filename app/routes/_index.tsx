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
    </div>
  );
}
