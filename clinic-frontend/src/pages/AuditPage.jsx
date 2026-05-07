// src/pages/admin/AuditLogs.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { auditLogService } from '@/api/auditLogService';
import { useToast } from '@/components/ui/use-toast';

const ACTION_TYPES = [
  'CREATE_MEDICAL_RECORD',
  'UPDATE_MEDICAL_RECORD',
  'DELETE_MEDICAL_RECORD',
  'BOOK_APPOINTMENT',
  'CANCEL_APPOINTMENT',
  'CHECK_IN_APPOINTMENT',
  'COMPLETE_APPOINTMENT',
  'CREATE_PATIENT',
  'UPDATE_PATIENT',
  'DELETE_PATIENT',
  'CREATE_DOCTOR',
  'UPDATE_DOCTOR',
  'DELETE_DOCTOR',
  'CREATE_USER',
  'LOGIN',
];

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let data;
      if (userIdFilter) {
        data = await auditLogService.getLogsByUser(userIdFilter);
      } else if (actionFilter) {
        data = await auditLogService.getLogsByAction(actionFilter);
      } else {
        data = await auditLogService.getAllLogs();
      }
      setLogs(data);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []); // initial load

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleUserIdClear = () => {
    setUserIdFilter('');
    // If no action filter, reload all
    if (!actionFilter) fetchLogs();
  };

  const handleActionChange = (value) => {
    setActionFilter(value);
    // Clear user ID filter if action selected
    if (value) setUserIdFilter('');
  };

  // When action filter changes, optionally fetch automatically
  useEffect(() => {
    if (actionFilter) fetchLogs();
  }, [actionFilter]);

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4 flex-wrap">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Filter by User ID"
              value={userIdFilter}
              onChange={(e) => {
                setUserIdFilter(e.target.value);
                if (e.target.value) setActionFilter(''); // clear action if typing user
              }}
              className="w-48"
            />
            <Button type="submit">Search User</Button>
            {userIdFilter && (
              <Button variant="ghost" onClick={handleUserIdClear}>
                Clear
              </Button>
            )}
          </form>

          <Select value={actionFilter} onValueChange={handleActionChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by Action" />
            </SelectTrigger>
            <SelectContent>
              {ACTION_TYPES.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No audit logs found</TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.userId}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.details || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogs;