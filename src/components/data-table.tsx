"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconBrain,
  IconMessage,
  IconCopy,
  IconX,
  IconDownload,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const schema = z.object({
  system_prompt: z.string(),
  user_prompt: z.string(),
  response: z.string(),
  user_id: z.string(),
  evaluator: z.string(),
  score: z.number(),
  feedback: z.string(),
  metadata: z.object({
    patient_id: z.string(),
    complexity: z.string(),
  }),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "score",
    header: () => <div className="text-center">Score</div>,
    cell: ({ row }) => {
      const score = row.original.score;
      const getBadgeClasses = (score: number) => {
        if (score >= 0.8) {
          return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
        } else if (score >= 0.6) {
          return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200";
        } else {
          return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200";
        }
      };

      return (
        <div className="text-center">
          <Badge className={`px-2 ${getBadgeClasses(score)}`}>
            {(score * 100).toFixed(1)}%
          </Badge>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const score = row.getValue(columnId) as number;
      switch (filterValue) {
        case "high":
          return score >= 0.8;
        case "medium":
          return score >= 0.6 && score < 0.8;
        case "low":
          return score < 0.6;
        default:
          return true;
      }
    },
    size: 80,
  },
      {
      accessorKey: "system_prompt",
      header: () => <div className="text-left">System Prompt</div>,
      cell: ({ row }) => {
        return (
          <div className="min-w-0 pr-4 h-8 flex items-center max-w-xs">
            <div className="flex items-center gap-2 w-full min-w-0">
              <IconMessage className="size-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate text-left">{row.original.system_prompt}</span>
            </div>
          </div>
        );
      },
      enableHiding: false,
      size: 280,
    },
    {
      accessorKey: "user_prompt",
      header: () => <div className="text-left">User Prompt</div>,
      cell: ({ row }) => {
        return (
          <div className="min-w-0 pr-4 h-8 flex items-center max-w-xs">
            <div className="flex items-center gap-2 w-full min-w-0">
              <IconMessage className="size-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate text-left">{row.original.user_prompt}</span>
            </div>
          </div>
        );
      },
      enableHiding: false,
      size: 280,
    },
  {
    accessorKey: "response",
    header: () => <div className="text-left">Response</div>,
    cell: ({ row }) => (
      <div className="max-w-xs pr-4 h-8 flex items-center">
        <span className="text-sm text-muted-foreground truncate">
          {row.original.response}
        </span>
      </div>
    ),
    size: 240,
  },
  {
    accessorKey: "evaluator",
    header: "Evaluator",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-2">
        <IconBrain className="mr-1 size-3" />
        {row.original.evaluator}
      </Badge>
    ),
  },
      {
      accessorKey: "feedback",
      header: "Feedback",
      cell: ({ row }) => (
        <div className="max-w-xs pr-4 h-8 flex items-center">
          <span className="text-sm text-muted-foreground truncate">
            {row.original.feedback}
          </span>
        </div>
      ),
    },
      {
      accessorFn: (row) => row.metadata.patient_id,
      id: "patient_id",
      header: "Patient ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm text-muted-foreground">
          {row.original.metadata.patient_id}
        </div>
      ),
    },
         {
      accessorFn: (row) => row.metadata.complexity,
      id: "complexity",
      header: "Complexity",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-2">
          {row.original.metadata.complexity}
        </Badge>
      ),
    },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
            onClick={(e) => e.stopPropagation()}
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Copy Request</DropdownMenuItem>
          <DropdownMenuItem>Copy Response</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function ClickableRow({
  row,
  children,
}: {
  row: {
    id: string;
    original: z.infer<typeof schema>;
    getIsSelected: () => boolean;
  };
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>
        <TableRow
          data-state={row.getIsSelected() && "selected"}
          className="hover:bg-muted/50 cursor-pointer"
        >
          {children}
        </TableRow>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Request Details</DrawerTitle>
          <DrawerDescription>
            Complete view of LLM request and response
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 overflow-y-auto px-4 text-sm">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-2">
              <IconBrain className="size-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Evaluator</div>
                <div className="text-muted-foreground">
                  {row.original.evaluator}
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium">Score</div>
              <Badge
                className={`${
                  row.original.score >= 0.8
                    ? "bg-green-100 text-green-700 border-green-200"
                    : row.original.score >= 0.6
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-orange-100 text-orange-700 border-orange-200"
                }`}
              >
                {(row.original.score * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="flex items-center gap-2">
              <div>
                <div className="font-medium">Patient ID</div>
                <div className="text-muted-foreground font-mono text-xs">
                  {row.original.metadata.patient_id}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <div className="font-medium">Complexity</div>
                <div className="text-muted-foreground">
                  {row.original.metadata.complexity}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">System Prompt</div>
              <div className="relative bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-background/90 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.system_prompt);
                    toast.success("System prompt copied!");
                  }}
                >
                  <IconCopy className="h-3 w-3" />
                </Button>
                {row.original.system_prompt}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">User Prompt</div>
              <div className="relative bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-background/90 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.user_prompt);
                    toast.success("User prompt copied!");
                  }}
                >
                  <IconCopy className="h-3 w-3" />
                </Button>
                {row.original.user_prompt}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Response</div>
              <div className="relative bg-muted p-3 rounded-md text-sm max-h-60 overflow-y-auto group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-background/90 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.response);
                    toast.success("Response copied!");
                  }}
                >
                  <IconCopy className="h-3 w-3" />
                </Button>
                {row.original.response}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Feedback</div>
              <div className="relative bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-background/90 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.feedback);
                    toast.success("Feedback copied!");
                  }}
                >
                  <IconCopy className="h-3 w-3" />
                </Button>
                {row.original.feedback}
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function DataTable({ data }: { data: z.infer<typeof schema>[] }) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row, index) => `${row.user_id}_${index}`,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const exportData = (format: "json" | "csv" | "txt") => {
    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);

    let content = "";
    let filename = "";
    let mimeType = "";

    switch (format) {
      case "json":
        content = JSON.stringify(filteredData, null, 2);
        filename = "requests_export.json";
        mimeType = "application/json";
        break;
      case "csv":
        const headers = [
          "User ID",
          "System Prompt",
          "User Prompt",
          "Response",
          "Evaluator",
          "Feedback",
          "Score",
          "Patient ID",
          "Complexity",
        ];
        const csvRows = [
          headers.join(","),
          ...filteredData.map((row) =>
            [
              row.user_id,
              `"${row.system_prompt.replace(/"/g, '""')}"`,
              `"${row.user_prompt.replace(/"/g, '""')}"`,
              `"${row.response.replace(/"/g, '""')}"`,
              row.evaluator,
              row.feedback,
              row.score,
              row.metadata.patient_id,
              row.metadata.complexity,
            ].join(",")
          ),
        ];
        content = csvRows.join("\n");
        filename = "requests_export.csv";
        mimeType = "text/csv";
        break;
      case "txt":
        content = filteredData
          .map(
            (row) =>
              `User ID: ${row.user_id}\nSystem Prompt: ${row.system_prompt}\nUser Prompt: ${row.user_prompt}\nResponse: ${
                row.response
              }\nEvaluator: ${row.evaluator}\nFeedback: ${
                row.feedback
              }\nScore: ${(row.score * 100).toFixed(
                1
              )}%\nPatient ID: ${row.metadata.patient_id}\nComplexity: ${
                row.metadata.complexity
              }\n\n---\n\n`
          )
          .join("");
        filename = "requests_export.txt";
        mimeType = "text/plain";
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Data exported as ${format.toUpperCase()}!`);
  };

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter system prompts..."
            value={
              (table.getColumn("system_prompt")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("system_prompt")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />

          <Input
            placeholder="Filter user prompts..."
            value={
              (table.getColumn("user_prompt")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("user_prompt")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />

          <Input
            placeholder="Patient ID..."
            value={
              (table.getColumn("patient_id")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("patient_id")?.setFilterValue(event.target.value)
            }
            className="w-44"
          />

          <Select
            value={(table.getColumn("evaluator")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table
                .getColumn("evaluator")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Evaluator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Evaluators</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="fastval">Fastval</SelectItem>
              <SelectItem value="gemma_shield">Gemma Shield</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              (table
                .getColumn("score")
                ?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("score")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="high">High (80%+)</SelectItem>
              <SelectItem value="medium">Medium (60-80%)</SelectItem>
              <SelectItem value="low">Low (60%-)</SelectItem>
            </SelectContent>
          </Select>

          {table.getState().columnFilters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.resetColumnFilters();
              }}
              className="h-8"
            >
              <IconX className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconDownload className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Export Data</span>
                <span className="lg:hidden">Export</span>
                <IconChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => exportData("json")}
                className="cursor-pointer"
              >
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportData("csv")}
                className="cursor-pointer"
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportData("txt")}
                className="cursor-pointer"
              >
                Export as TXT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="text-left align-top py-3"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <ClickableRow key={row.id} row={row}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="align-middle py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </ClickableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {table.getFilteredRowModel().rows.length} result(s).
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para primeira página</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para próxima página</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para última página</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
