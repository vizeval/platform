import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionCards />

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
