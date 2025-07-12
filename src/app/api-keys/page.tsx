import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ApiKeysTable } from "@/components/api-keys-table";

export default function ApiKeysPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Keep your API keys safe and do not share them publicly.
        </p>

        <Button>
          <IconPlus />
          Add API Key
        </Button>
      </div>

      <ApiKeysTable />
    </div>
  );
}
