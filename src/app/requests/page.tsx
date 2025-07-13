import data from "@/mocks/dashboard-cards.json";
import { DataTable } from "@/components/data-table";

export default function Page() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Keep track of all your requests.
      </p>

      <DataTable data={data} />
    </div>
  );
}
