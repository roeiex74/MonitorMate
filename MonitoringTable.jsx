import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { Activity, Database, Globe, Server, Cpu, ChevronRight } from 'lucide-react';

const typeIcons = {
  service: <Server className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  api: <Activity className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  custom: <Cpu className="w-4 h-4" />
};

const healthColors = {
  healthy: "bg-green-100 text-green-800 border-green-200",
  degraded: "bg-yellow-100 text-yellow-800 border-yellow-200",
  critical: "bg-red-100 text-red-800 border-red-200"
};

export default function MonitoringTable({ monitors, selectedIds, onSelectChange, onRowClick }) {
  const toggleSelectAll = (checked) => {
    if (checked) {
      onSelectChange(monitors.map(m => m.id));
    } else {
      onSelectChange([]);
    }
  };

  const toggleSelect = (e, monitorId) => {
    e.stopPropagation();
    if (selectedIds.includes(monitorId)) {
      onSelectChange(selectedIds.filter(id => id !== monitorId));
    } else {
      onSelectChange([...selectedIds, monitorId]);
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedIds.length === monitors.length && monitors.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Monitor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Check</TableHead>
            <TableHead>Check Interval</TableHead>
            <TableHead className="w-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monitors.map((monitor) => (
            <TableRow 
              key={monitor.id}
              className={`${monitor.status === 'disabled' ? 'opacity-60' : ''} cursor-pointer hover:bg-gray-50`}
              onClick={() => onRowClick && onRowClick(monitor.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={selectedIds.includes(monitor.id)}
                  onCheckedChange={(checked) => {
                    const e = { stopPropagation: () => {} };
                    toggleSelect(e, monitor.id);
                  }}
                  aria-label={`Select ${monitor.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">{monitor.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {typeIcons[monitor.type]}
                  <span className="capitalize">{monitor.type}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={healthColors[monitor.health]}>
                  {monitor.health}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={monitor.status === 'active' ? 'outline' : 'secondary'}>
                  {monitor.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {formatDistanceToNow(new Date(monitor.last_check), { addSuffix: true })}
              </TableCell>
              <TableCell>
                {monitor.configuration.check_interval} min
              </TableCell>
              <TableCell>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
