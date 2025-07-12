import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardTooltip,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Evaluations</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2.345
          </CardTitle>
          <CardTooltip>
            <p>The total number of evaluations.</p>
          </CardTooltip>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Evaluation Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            9.5
          </CardTitle>
          <CardTooltip>
            <p>The average evaluation score.</p>
          </CardTooltip>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Evaluation Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1.2s
          </CardTitle>
          <CardTooltip>
            <p>The average evaluation time.</p>
          </CardTooltip>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tokens per Request</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            262.868
          </CardTitle>
          <CardTooltip>
            <p>The average tokens per request.</p>
          </CardTooltip>
        </CardHeader>
      </Card>
    </div>
  );
}
