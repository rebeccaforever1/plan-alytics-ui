// src/app/dashboard/connections/page.tsx
'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react'

// Mock data for connections
const connectionTypes = [
  { id: 'stripe', name: 'Stripe', icon: '💳', category: 'Payment' },
  { id: 'shopify', name: 'Shopify', icon: '🛒', category: 'E-commerce' },
  { id: 'salesforce', name: 'Salesforce', icon: '📊', category: 'CRM' },
  { id: 'hubspot', name: 'HubSpot', icon: '🎯', category: 'Marketing' },
  { id: 'mysql', name: 'MySQL', icon: '🗄️', category: 'Database' },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { id: 'bigquery', name: 'BigQuery', icon: '📈', category: 'Data Warehouse' },
  { id: 'snowflake', name: 'Snowflake', icon: '❄️', category: 'Data Warehouse' },
]

const mockConnections = [
  {
    id: '1',
    name: 'Production Stripe',
    type: 'stripe',
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    syncStatus: 'success',
    recordsSynced: 12456,
    nextSync: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Shopify Store',
    type: 'shopify',
    status: 'connected',
    lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000),
    syncStatus: 'success',
    recordsSynced: 8934,
    nextSync: new Date(Date.now() + 4 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Salesforce CRM',
    type: 'salesforce',
    status: 'error',
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
    syncStatus: 'failed',
    recordsSynced: 0,
    nextSync: new Date(Date.now() + 1 * 60 * 60 * 1000),
    error: 'Authentication failed'
  },
  {
    id: '4',
    name: 'Analytics Database',
    type: 'postgresql',
    status: 'connected',
    lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000),
    syncStatus: 'success',
    recordsSynced: 56789,
    nextSync: new Date(Date.now() + 3 * 60 * 60 * 1000),
  },
]

// Simple Label component since we can't import it
const Label = ({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) => {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  )
}

export default function ConnectionsPage() {
  const [selectedType, setSelectedType] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: '',
    apiKey: '',
    secret: '',
  })

  const handleAddConnection = () => {
    console.log('Adding connection:', newConnection)
    setIsAdding(false)
    setNewConnection({ name: '', type: '', apiKey: '', secret: '' })
  }

  const getStatusBadge = (status: string, syncStatus?: string) => {
    if (status === 'error') {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Error</Badge>
    }
    if (syncStatus === 'success') {
      return <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3" /> Connected</Badge>
    }
    return <Badge variant="secondary" className="flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Syncing</Badge>
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Connections</h1>
          <p className="text-sm text-gray-600">Manage your data sources and integrations</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </div>

      {/* Connection Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-500">Active data sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3/4</div>
            <p className="text-xs text-gray-500">Successful syncs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-gray-500">Most recent update</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.2k</div>
            <p className="text-xs text-gray-500">Synced data points</p>
          </CardContent>
        </Card>
      </div>

      {/* Connections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Connections</CardTitle>
          <CardDescription>Manage your data sources and sync settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Connection</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Next Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockConnections.map((connection) => {
                const connectionType = connectionTypes.find(t => t.id === connection.type)
                return (
                  <TableRow key={connection.id}>
                    <TableCell className="font-medium">{connection.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{connectionType?.icon}</span>
                        {connectionType?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(connection.status, connection.syncStatus)}
                      {connection.error && (
                        <p className="text-xs text-red-600 mt-1">{connection.error}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatTime(connection.lastSync)}</div>
                      <div className="text-xs text-gray-500">{formatDate(connection.lastSync)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">
                        {connection.recordsSynced.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatTime(connection.nextSync)}</div>
                      <div className="text-xs text-gray-500">{formatDate(connection.nextSync)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Connection Modal */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Connection</CardTitle>
            <CardDescription>Connect a new data source to your analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Connection Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production Stripe"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Connection Type</Label>
                  <Select
                    value={newConnection.type}
                    onValueChange={(value) => setNewConnection({ ...newConnection, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {connectionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.name}
                            <span className="text-xs text-gray-500 ml-2">({type.category})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {newConnection.type && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your API key"
                      value={newConnection.apiKey}
                      onChange={(e) => setNewConnection({ ...newConnection, apiKey: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secret">API Secret</Label>
                    <Input
                      id="secret"
                      type="password"
                      placeholder="Enter your API secret"
                      value={newConnection.secret}
                      onChange={(e) => setNewConnection({ ...newConnection, secret: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddConnection}>
                  Connect
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Source Types */}
      <Card>
        <CardHeader>
          <CardTitle>Available Data Sources</CardTitle>
          <CardDescription>Supported platforms and integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connectionTypes.map((type) => (
              <Card key={type.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h4 className="font-semibold">{type.name}</h4>
                      <p className="text-sm text-gray-500">{type.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}