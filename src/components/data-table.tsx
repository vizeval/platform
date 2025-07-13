"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconClock,
  IconBrain,
  IconMessage,
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
  DropdownMenuCheckboxItem,
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
    accessorKey: "request",
    header: () => <div className="text-left">Request</div>,
    cell: ({ row }) => {
      return (
        <div className="min-w-0 pr-4 h-8 flex items-center max-w-xs">
          <TableCellViewer item={row.original} />
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
    accessorKey: "evaluation_score",
    header: () => <div className="text-right">Score</div>,
    cell: ({ row }) => {
      const score = row.original.evaluation_score;
      const variant =
        score >= 0.8 ? "default" : score >= 0.6 ? "secondary" : "destructive";

      return (
        <div className="text-right">
          <Badge variant={variant} className="px-2">
            {(score * 100).toFixed(1)}%
          </Badge>
        </div>
      );
    },
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
      <div className="text-right">
        <div className="flex items-center justify-end gap-1">
          <IconClock className="size-3 text-muted-foreground" />
          <span className="text-sm">{row.original.latency}ms</span>
        </div>
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
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace("_", " ")}
                    </DropdownMenuCheckboxItem>
                  );
                })}
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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="align-middle py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
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

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground h-8 px-0 text-left justify-start font-normal hover:underline w-full"
        >
          <div className="flex items-center gap-2 w-full min-w-0">
            <IconMessage className="size-4 flex-shrink-0 text-muted-foreground" />
            <span className="truncate text-left">{item.request}</span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Detalhes do Request</DrawerTitle>
          <DrawerDescription>
            Visualização completa do request e response da LLM
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 overflow-y-auto px-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <IconBrain className="size-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Model</div>
                <div className="text-muted-foreground">{item.model}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconBrain className="size-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Evaluator Model</div>
                <div className="text-muted-foreground">
                  {item.evaluator_model}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="font-medium">Score</div>
                <Badge
                  variant={
                    item.evaluation_score >= 0.8
                      ? "default"
                      : item.evaluation_score >= 0.6
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {(item.evaluation_score * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="size-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Latency</div>
                <div className="text-muted-foreground">{item.latency}ms</div>
              </div>
            </div>
            <div>
              <div className="font-medium">Prompt ID</div>
              <div className="text-muted-foreground font-mono text-xs">
                {item.prompt_id}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Request</div>
              <div className="bg-muted p-3 rounded-md text-sm max-h-32 overflow-y-auto">
                {item.request}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Response</div>
              <div className="bg-muted p-3 rounded-md text-sm max-h-64 overflow-y-auto">
                {item.response}
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(item.request);
                toast.success("Request copiado!");
              }}
            >
              Copiar Request
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(item.response);
                toast.success("Response copiado!");
              }}
            >
              Copiar Response
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
