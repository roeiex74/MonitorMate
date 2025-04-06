import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Monitor } from '@/entities/Monitor';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Share2 } from "lucide-react";
import MonitoringTable from '../components/monitoring/MonitoringTable';
import MonitoringToolbar from '../components/monitoring/MonitoringToolbar';

export default function MonitoringDashboard() {
  const [monitors, setMonitors] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMigrateDialogOpen, setMigrateDialogOpen] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, loading, success
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadMonitors();
  }, []);

  const loadMonitors = async () => {
    setLoading(true);
    const data = await Monitor.list();
    setMonitors(data);
    setLoading(false);
  };

  const handleExport = async () => {
    const selectedMonitors = monitors.filter(m => selectedIds.includes(m.id));
    const csvContent = [
      ["Name", "Type", "Health", "Status", "Last Check", "Check Interval"].join(','),
      ...selectedMonitors.map(monitor => [
        monitor.name,
        monitor.type,
        monitor.health,
        monitor.status,
        monitor.last_check,
        monitor.configuration.check_interval
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'monitors.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `Exported ${selectedIds.length} monitors to CSV`,
    });
  };

  const handleDisable = async () => {
    for (const id of selectedIds) {
      await Monitor.update(id, { status: 'disabled' });
    }
    
    toast({
      title: "Monitors Disabled",
      description: `Successfully disabled ${selectedIds.length} monitors`,
    });

    setSelectedIds([]);
    loadMonitors();
  };

  const handleMigrate = async () => {
    setMigrateDialogOpen(true);
    setMigrationStatus('loading');
    
    // Simulate migration process
    setTimeout(() => {
      setMigrationStatus('success');
      
      setTimeout(() => {
        setMigrateDialogOpen(false);
        setMigrationStatus('idle');
        setSelectedIds([]);
        
        toast({
          title: "Migration Complete",
          description: `Successfully migrated ${selectedIds.length} monitors to new server`,
        });
      }, 1500);
    }, 2000);
  };

  const handleRowClick = (monitorId) => {
    navigate(createPageUrl(`MonitorOverview?id=${monitorId}`));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <MonitoringToolbar 
        selectedIds={selectedIds}
        onExport={handleExport}
        onDisable={handleDisable}
        onMigrate={handleMigrate}
      />
      
      <MonitoringTable
        monitors={monitors}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        onRowClick={handleRowClick}
      />

      <Dialog open={isMigrateDialogOpen} onOpenChange={setMigrateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Migrate Monitors</DialogTitle>
            <DialogDescription>
              Migrate the selected monitors to a new server.
            </DialogDescription>
          </DialogHeader>
          
          {migrationStatus === 'loading' && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
              <p className="text-gray-600">Migrating monitors...</p>
            </div>
          )}
          
          {migrationStatus === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium">Migration Complete!</p>
              <p className="text-gray-600 text-center mt-1">
                All selected monitors have been successfully migrated
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
