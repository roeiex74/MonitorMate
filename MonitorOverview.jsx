import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Monitor } from '@/entities/Monitor';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Download, Power, Share2, Server, Database, Activity, Globe, Cpu, CheckCircle } from 'lucide-react';

export default function MonitorOverview() {
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMigrateDialogOpen, setMigrateDialogOpen] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, loading, success
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMonitor = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const monitorId = urlParams.get('id');
      
      if (!monitorId) {
        navigate(createPageUrl('MonitoringDashboard'));
        return;
      }
      
      setLoading(true);
      try {
        const data = await Monitor.list();
        const foundMonitor = data.find(m => m.id === monitorId);
        
        if (foundMonitor) {
          setMonitor(foundMonitor);
        } else {
          navigate(createPageUrl('MonitoringDashboard'));
          toast({
            title: "Monitor not found",
            description: "The requested monitor could not be found.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching monitor:", error);
        toast({
          title: "Error",
          description: "Failed to load monitor details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMonitor();
  }, []);

  const getTypeIcon = (type) => {
    const iconMap = {
      service: <Server className="w-5 h-5" />,
      database: <Database className="w-5 h-5" />,
      api: <Activity className="w-5 h-5" />,
      website: <Globe className="w-5 h-5" />,
      custom: <Cpu className="w-5 h-5" />
    };
    return iconMap[type] || iconMap.custom;
  };

  const getHealthColor = (health) => {
    const colorMap = {
      healthy: "bg-green-100 text-green-800 border-green-200",
      degraded: "bg-yellow-100 text-yellow-800 border-yellow-200",
      critical: "bg-red-100 text-red-800 border-red-200"
    };
    return colorMap[health] || "";
  };

  const handleExport = () => {
    if (!monitor) return;
    
    const csvContent = [
      ["Name", "Type", "Health", "Status", "Last Check", "Check Interval"].join(','),
      [
        monitor.name,
        monitor.type,
        monitor.health,
        monitor.status,
        monitor.last_check,
        monitor.configuration.check_interval
      ].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `monitor-${monitor.name}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `Exported ${monitor.name} to CSV`,
    });
  };

  const handleDisable = async () => {
    if (!monitor) return;

    try {
      await Monitor.update(monitor.id, { status: 'disabled' });
      setMonitor(prev => ({ ...prev, status: 'disabled' }));
      
      toast({
        title: "Monitor Disabled",
        description: `Successfully disabled ${monitor.name}`,
      });
    } catch (error) {
      console.error("Error disabling monitor:", error);
      toast({
        title: "Error",
        description: "Failed to disable monitor.",
        variant: "destructive"
      });
    }
  };

  const handleMigrate = async () => {
    if (!monitor) return;
    
    setMigrationStatus('loading');
    
    // Simulate migration process
    setTimeout(() => {
      setMigrationStatus('success');
      
      setTimeout(() => {
        setMigrateDialogOpen(false);
        setMigrationStatus('idle');
        
        toast({
          title: "Migration Complete",
          description: `Successfully migrated ${monitor.name} to new server`,
        });
      }, 1500);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!monitor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-600 mb-4">Monitor not found</p>
        <Button onClick={() => navigate(createPageUrl('MonitoringDashboard'))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(createPageUrl('MonitoringDashboard'))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${monitor.health === 'healthy' ? 'bg-green-100' : monitor.health === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'}`}>
              {getTypeIcon(monitor.type)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{monitor.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={getHealthColor(monitor.health)}>
                  {monitor.health}
                </Badge>
                <Badge variant={monitor.status === 'active' ? 'outline' : 'secondary'}>
                  {monitor.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setMigrateDialogOpen(true)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Migrate
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleDisable}
              disabled={monitor.status === 'disabled'}
            >
              <Power className="w-4 h-4 mr-2" />
              {monitor.status === 'disabled' ? 'Disabled' : 'Disable'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monitor Details</CardTitle>
            <CardDescription>Technical details about this monitor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{monitor.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{monitor.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Health</p>
                  <p className="font-medium">{monitor.health}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Check</p>
                  <p className="font-medium">{new Date(monitor.last_check).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Monitor configuration parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Check Interval</p>
                  <p className="font-medium">{monitor.configuration.check_interval} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timeout</p>
                  <p className="font-medium">{monitor.configuration.timeout} seconds</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isMigrateDialogOpen} onOpenChange={setMigrateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Migrate Monitor</DialogTitle>
            <DialogDescription>
              Migrate this monitor to a new server. This will transfer all configuration and history.
            </DialogDescription>
          </DialogHeader>
          
          {migrationStatus === 'idle' && (
            <>
              <div className="py-4">
                <p>Are you sure you want to migrate <strong>{monitor.name}</strong>?</p>
                <p className="text-sm text-gray-500 mt-2">
                  This action will move the monitor to the new infrastructure.
                  There may be a brief downtime during the migration process.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMigrateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMigrate}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Migrate Monitor
                </Button>
              </DialogFooter>
            </>
          )}
          
          {migrationStatus === 'loading' && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
              <p className="text-gray-600">Migrating monitor...</p>
            </div>
          )}
          
          {migrationStatus === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium">Migration Complete!</p>
              <p className="text-gray-600 text-center mt-1">
                Monitor has been successfully migrated
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
