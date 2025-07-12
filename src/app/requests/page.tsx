import data from "@/mocks/dashboard-cards.json";
import { DataTable } from "@/components/data-table";

export default function Page() {
  return (
    <DataTable data={data} />
  );
}
