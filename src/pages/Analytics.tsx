import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  Users,
  Building,
  Calendar
} from "lucide-react";

const Analytics = () => {
  const monthlyData = [
    { month: "Jan", verified: 245, invalid: 15, pending: 8 },
    { month: "Feb", verified: 312, invalid: 22, pending: 12 },
    { month: "Mar", verified: 428, invalid: 18, pending: 15 },
    { month: "Apr", verified: 389, invalid: 31, pending: 9 },
    { month: "May", verified: 467, invalid: 28, pending: 18 },
    { month: "Jun", verified: 523, invalid: 35, pending: 14 }
  ];

  const institutionStats = [
    { name: "ABC University", total: 1247, valid: 1198, invalid: 49, rate: 96.1 },
    { name: "XYZ College", total: 892, valid: 845, invalid: 47, rate: 94.7 },
    { name: "PQR Institute", total: 634, valid: 612, invalid: 22, rate: 96.5 },
    { name: "LMN Academy", total: 445, valid: 398, invalid: 47, rate: 89.4 },
    { name: "DEF University", total: 329, valid: 315, invalid: 14, rate: 95.7 }
  ];

  const flaggedTrends = [
    { category: "Formatting Issues", count: 89, trend: "up" },
    { category: "Invalid Signatures", count: 67, trend: "down" }, 
    { category: "Fake Watermarks", count: 45, trend: "up" },
    { category: "Wrong Institution Info", count: 34, trend: "stable" },
    { category: "Altered Marks", count: 23, trend: "down" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive insights into certificate verification activities and fraud detection
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Detection Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5%</div>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <TrendingDown className="h-3 w-3" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Institutions</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              +5 new this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingDown className="h-3 w-3" />
              -0.7s improvement
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Verification Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Verification Trends
            </CardTitle>
            <CardDescription>
              Certificate verification activity over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month} 2024</span>
                    <span className="text-muted-foreground">
                      {data.verified + data.invalid + data.pending} total
                    </span>
                  </div>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-success" 
                      style={{ width: `${(data.verified / (data.verified + data.invalid + data.pending)) * 100}%` }}
                    />
                    <div 
                      className="bg-destructive" 
                      style={{ width: `${(data.invalid / (data.verified + data.invalid + data.pending)) * 100}%` }}
                    />
                    <div 
                      className="bg-warning" 
                      style={{ width: `${(data.pending / (data.verified + data.invalid + data.pending)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Valid: {data.verified}</span>
                    <span>Invalid: {data.invalid}</span>
                    <span>Pending: {data.pending}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Institutions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Institution Performance
            </CardTitle>
            <CardDescription>
              Top performing institutions by verification rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {institutionStats.map((institution, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{institution.name}</span>
                    <Badge 
                      variant={institution.rate >= 95 ? "default" : institution.rate >= 90 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {institution.rate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total: {institution.total}</span>
                    <span>Valid: {institution.valid}</span>
                    <span>Invalid: {institution.invalid}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1">
                    <div 
                      className="bg-primary h-1 rounded-full"
                      style={{ width: `${institution.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Detection Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Fraud Detection Categories
          </CardTitle>
          <CardDescription>
            Most common types of certificate fraud detected by the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {flaggedTrends.map((trend, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{trend.category}</span>
                  {trend.trend === "up" && <TrendingUp className="h-3 w-3 text-destructive" />}
                  {trend.trend === "down" && <TrendingDown className="h-3 w-3 text-success" />}
                  {trend.trend === "stable" && <div className="h-3 w-3 rounded-full bg-muted" />}
                </div>
                <div className="text-2xl font-bold">{trend.count}</div>
                <div className="text-xs text-muted-foreground">
                  {trend.trend === "up" && "Increasing"}
                  {trend.trend === "down" && "Decreasing"}
                  {trend.trend === "stable" && "Stable"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;