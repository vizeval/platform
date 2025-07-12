import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconScale, IconStethoscope, IconBook } from "@tabler/icons-react";

const evaluators = [
  {
    id: "medical",
    name: "Medical",
    description:
      "Specialized agent for evaluating medical content, diagnoses, and health protocols.",
    icon: IconStethoscope,
    capabilities: ["Diagnostic analysis", "Medical protocols"],
    isActive: true,
    bgColor: "bg-emerald-50/50",
    iconColor: "text-emerald-400",
  },
  {
    id: "legal",
    name: "Legal",
    description:
      "Specialized agent for analyzing and evaluating legal content, legal documents, and regulatory compliance.",
    icon: IconScale,
    capabilities: ["Contract analysis", "Legal terms review"],
    isActive: false,
    bgColor: "bg-blue-50/50",
    iconColor: "text-blue-400",
  },
  {
    id: "education",
    name: "Education",
    description:
      "Specialized agent for evaluating educational content, curriculum materials, and learning assessments.",
    icon: IconBook,
    capabilities: ["Curriculum analysis", "Learning standards"],
    isActive: false,
    bgColor: "bg-amber-50/50",
    iconColor: "text-amber-400",
  },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Specialized evaluators that analyze prompts and LLM outputs by
          knowledge area.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluators.map((evaluator) => {
          const IconComponent = evaluator.icon;

          return (
            <Card
              key={evaluator.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${evaluator.bgColor}`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${evaluator.iconColor}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">
                          {evaluator.name}
                        </CardTitle>
                        {evaluator.isActive && (
                          <Badge variant="outline" className="text-xs">
                            ID: eval_{evaluator.id}
                          </Badge>
                        )}
                        {!evaluator.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {evaluator.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {evaluator.capabilities.map((capability, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
