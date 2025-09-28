import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Certificates Verified",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Shield,
      color: "primary"
    },
    {
      title: "Valid Certificates",
      value: "2,623",
      change: "92.1%",
      trend: "up", 
      icon: CheckCircle,
      color: "success"
    },
    {
      title: "Flagged as Fake",
      value: "186",
      change: "6.5%",
      trend: "down",
      icon: AlertTriangle,
      color: "destructive"
    },
    {
      title: "Under Review",
      value: "38",
      change: "1.3%",
      trend: "neutral",
      icon: Clock,
      color: "warning"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Certificate Verified",
      entity: "ABC University",
      student: "John Doe",
      status: "valid",
      time: "2 minutes ago"
    },
    {
      id: 2,
      action: "Fake Certificate Detected",
      entity: "XYZ College",
      student: "Jane Smith",
      status: "invalid",
      time: "15 minutes ago"
    },
    {
      id: 3,
      action: "Certificate Under Review",
      entity: "PQR Institute",
      student: "Mike Johnson",
      status: "review",
      time: "1 hour ago"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of certificate verification activities and system status
          </p>
        </div>
        
        <Button onClick={() => navigate("/verify")} className="gap-2">
          <Upload className="h-4 w-4" />
          Verify Certificate
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 text-${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access frequently used verification tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate("/verify")}
            >
              <Upload className="h-4 w-4" />
              Upload & Verify Certificate
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate("/analytics")}
            >
              <BarChart3 className="h-4 w-4" />
              View Analytics Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate("/admin")}
            >
              <Shield className="h-4 w-4" />
              Access Admin Portal
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest certificate verification activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.entity} • {activity.student}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge 
                      variant={
                        activity.status === "valid" ? "default" : 
                        activity.status === "invalid" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {activity.status === "valid" ? "Valid" : 
                       activity.status === "invalid" ? "Invalid" : "Review"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;