import mockedData from "@/mocks/dashboard-cards.json";

import { DataTable } from "@/components/data-table";

async function getEvaluations() {
  try {
    const response = await fetch(
      "http://localhost:8000/user/evaluations?api_key=mock-api-key",
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch evaluations");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return [];
  }
}

export default async function Page() {
  const data = await getEvaluations();

  console.log(data);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Keep track of all your requests.
      </p>

      <DataTable data={mockedData} />
    </div>
  );
}
