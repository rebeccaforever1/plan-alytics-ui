          <TabsTrigger value="integrations">Integrations</TabsTrigger>



           <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Integrations</CardTitle>
              <CardDescription>Connected marketing and CRM platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'HubSpot', status: 'Connected', type: 'CRM', records: 45234 },
                  { name: 'Google Ads', status: 'Connected', type: 'Advertising', records: 12890 },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-xs text-gray-500">{integration.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatNumber(integration.records)} records</p>
                      <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>