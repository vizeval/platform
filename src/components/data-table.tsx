"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconClock,
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
  id: z.number(),
  request: z.string(),
  response: z.string(),
  model: z.string(),
  evaluator_model: z.string(),
  evaluation_score: z.number(),
  prompt_id: z.string(),
  latency: z.number(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "evaluation_score",
    header: () => <div className="text-center">Score</div>,
    cell: ({ row }) => {
      const score = row.original.evaluation_score;
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
    accessorKey: "request",
    header: () => <div className="text-left">Request</div>,
    cell: ({ row }) => {
      return (
        <div className="min-w-0 pr-4 h-8 flex items-center max-w-xs">
          <div className="flex items-center gap-2 w-full min-w-0">
            <IconMessage className="size-4 flex-shrink-0 text-muted-foreground" />
            <span className="truncate text-left">{row.original.request}</span>
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
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-2">
        <IconBrain className="mr-1 size-3" />
        {row.original.model}
      </Badge>
    ),
  },
  {
    accessorKey: "evaluator_model",
    header: "Evaluator Model",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-muted-foreground px-2">
        <IconBrain className="mr-1 size-3" />
        {row.original.evaluator_model}
      </Badge>
    ),
  },
  {
    accessorKey: "prompt_id",
    header: "Prompt ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm text-muted-foreground">
        {row.original.prompt_id}
      </div>
    ),
  },
  {
    accessorKey: "latency",
    header: () => <div className="text-right">Latency</div>,
    cell: ({ row }) => (
      <div className="text-left">
        <span className="text-sm">{row.original.latency}ms</span>
      </div>
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
                <div className="font-medium">Model</div>
                <div className="text-muted-foreground">
                  {row.original.model}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconBrain className="size-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Evaluator Model</div>
                <div className="text-muted-foreground">
                  {row.original.evaluator_model}
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium">Score</div>
              <Badge
                className={`${
                  row.original.evaluation_score >= 0.8
                    ? "bg-green-100 text-green-700 border-green-200"
                    : row.original.evaluation_score >= 0.6
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-orange-100 text-orange-700 border-orange-200"
                }`}
              >
                {(row.original.evaluation_score * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="flex items-center gap-2">
              <IconClock className="size-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Latency</div>
                <div className="text-muted-foreground">
                  {row.original.latency}ms
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <div className="font-medium">Prompt ID</div>
                <div className="text-muted-foreground font-mono text-xs">
                  {row.original.prompt_id}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Request</div>
              <div className="relative bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-background/90 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.request);
                    toast.success("Request copied!");
                  }}
                >
                  <IconCopy className="h-3 w-3" />
                </Button>
                {row.original.request}
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
    getRowId: (row) => row.id.toString(),
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
          "ID",
          "Request",
          "Response",
          "Model",
          "Evaluator Model",
          "Score",
          "Prompt ID",
          "Latency",
        ];
        const csvRows = [
          headers.join(","),
          ...filteredData.map((row) =>
            [
              row.id,
              `"${row.request.replace(/"/g, '""')}"`,
              `"${row.response.replace(/"/g, '""')}"`,
              row.model,
              row.evaluator_model,
              row.evaluation_score,
              row.prompt_id,
              row.latency,
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
              `ID: ${row.id}\nRequest: ${row.request}\nResponse: ${
                row.response
              }\nModel: ${row.model}\nEvaluator Model: ${
                row.evaluator_model
              }\nScore: ${(row.evaluation_score * 100).toFixed(
                1
              )}%\nPrompt ID: ${row.prompt_id}\nLatency: ${
                row.latency
              }ms\n\n---\n\n`
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
            placeholder="Filter requests..."
            value={
              (table.getColumn("request")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("request")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />

          <Input
            placeholder="Prompt ID..."
            value={
              (table.getColumn("prompt_id")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("prompt_id")?.setFilterValue(event.target.value)
            }
            className="w-44"
          />

          <Select
            value={(table.getColumn("model")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table
                .getColumn("model")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5-turbo</SelectItem>
              <SelectItem value="claude-3-opus">Claude-3-opus</SelectItem>
              <SelectItem value="claude-3-sonnet">Claude-3-sonnet</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              (table
                .getColumn("evaluation_score")
                ?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("evaluation_score")
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
