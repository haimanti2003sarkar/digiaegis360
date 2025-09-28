import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Database,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Profile Settings
    name: "Admin User",
    email: "admin@certifyguard.com",
    organization: "State Education Department",
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    
    // Notification Settings
    emailAlerts: true,
    fraudAlerts: true,
    weeklyReports: true,
    
    // System Settings
    ocrConfidenceThreshold: 85,
    autoApprovalThreshold: 95,
    maxFileSize: 10,
    
    // Integration Settings
    apiEndpoint: "https://api.certifyguard.com/v1",
    webhookUrl: ""
  });

  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Simulate saving settings
    toast({
      title: "Settings saved successfully",
      description: "All configuration changes have been applied"
    });
  };

  const handleResetApiKey = () => {
    toast({
      title: "API key regenerated",
      description: "Your new API key has been generated. Please update your integrations."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, security, and system configuration preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => handleSettingChange("name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange("email", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={settings.organization}
                onChange={(e) => handleSettingChange("organization", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security and access control options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>API Key Management</Label>
              <div className="flex gap-2">
                <Input 
                  value="sk-1234567890abcdef..." 
                  readOnly 
                  className="font-mono text-xs"
                />
                <Button variant="outline" size="sm" onClick={handleResetApiKey}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure alert preferences and reporting options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important events
                </p>
              </div>
              <Switch
                checked={settings.emailAlerts}
                onCheckedChange={(checked) => handleSettingChange("emailAlerts", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Fraud Detection Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Immediate alerts for detected fraudulent certificates
                </p>
              </div>
              <Switch
                checked={settings.fraudAlerts}
                onCheckedChange={(checked) => handleSettingChange("fraudAlerts", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Automated weekly summary reports
                </p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Configuration
            </CardTitle>
            <CardDescription>
              Advanced system settings and thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ocrThreshold">OCR Confidence Threshold (%)</Label>
              <Input
                id="ocrThreshold"
                type="number"
                min="50"
                max="100"
                value={settings.ocrConfidenceThreshold}
                onChange={(e) => handleSettingChange("ocrConfidenceThreshold", parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Minimum confidence level for OCR text extraction
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autoApproval">Auto-Approval Threshold (%)</Label>
              <Input
                id="autoApproval"
                type="number"
                min="80"
                max="100"
                value={settings.autoApprovalThreshold}
                onChange={(e) => handleSettingChange("autoApprovalThreshold", parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Automatic approval for certificates above this confidence level
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                min="1"
                max="50"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange("maxFileSize", parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Integration Settings
            </CardTitle>
            <CardDescription>
              Configure external API endpoints and webhook URLs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={settings.apiEndpoint}
                  onChange={(e) => handleSettingChange("apiEndpoint", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://your-app.com/webhook"
                  value={settings.webhookUrl}
                  onChange={(e) => handleSettingChange("webhookUrl", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Integration Status</Label>
              <div className="flex gap-2">
                <Badge variant="default" className="gap-1">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  Database Connected
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  OCR Service Active
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  Blockchain Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;