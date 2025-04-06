import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Power, Filter, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MonitoringToolbar({ selectedIds, onExport, onDisable, onMigrate }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Monitoring Dashboard</h1>
        <Badge variant="secondary" className="bg-gray-100">
          {selectedIds.length} selected
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Show Active Only</DropdownMenuItem>
            <DropdownMenuItem>Show Critical Health</DropdownMenuItem>
            <DropdownMenuItem>Show Degraded Health</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={selectedIds.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onMigrate}
          disabled={selectedIds.length === 0}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Migrate
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onDisable}
          disabled={selectedIds.length === 0}
        >
          <Power className="w-4 h-4 mr-2" />
          Disable
        </Button>
      </div>
    </div>
  );
}
