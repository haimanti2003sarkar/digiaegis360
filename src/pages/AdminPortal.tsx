import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  UserCheck, 
  Building, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPortal = () => {
  const { toast } = useToast();
  
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [blacklistedCertificates, setBlacklistedCertificates] = useState([]);
  const [showAddInstitution, setShowAddInstitution] = useState(false);
  const [showAddBlacklist, setShowAddBlacklist] = useState(false);
  const [newInstitution, setNewInstitution] = useState({ name: "", type: "", status: "active" });
  const [newBlacklist, setNewBlacklist] = useState({ certificateId: "", reason: "", reportedBy: "", associatedInstitution: "" });
  function fetchData() {
    Promise.all([
      axios.get("http://localhost:5001/verification-requests"),
      axios.get("http://localhost:5001/institutions"),
      axios.get("http://localhost:5001/blacklisted-certificates")
    ]).then(([reqRes, instRes, blRes]) => {
      setVerificationRequests(reqRes.data || []);
      setInstitutions(instRes.data || []);
      setBlacklistedCertificates(blRes.data || []);
    });
  }
  useEffect(() => { fetchData(); }, []);

  async function handleAddInstitution() {
    try {
      await axios.post("http://localhost:5001/institutions", newInstitution);
      setShowAddInstitution(false);
      setNewInstitution({ name: "", type: "", status: "active" });
      fetchData();
      toast({ title: "Institution added" });
    } catch (err) {
      toast({ title: "Failed to add institution", variant: "destructive" });
    }
  }
  async function handleAddBlacklist() {
    try {
      await axios.post("http://localhost:5001/blacklisted-certificates", newBlacklist);
      setShowAddBlacklist(false);
      setNewBlacklist({ certificateId: "", reason: "", reportedBy: "", associatedInstitution: "" });
      fetchData();
      toast({ title: "Blacklisted certificate added" });
    } catch (err) {
      toast({ title: "Failed to add to blacklist", variant: "destructive" });
    }
  }


  const handleApprove = (requestId: string) => {
    toast({
      title: "Request approved",
      description: `Verification request ${requestId} has been approved`
    });
  };

  const handleReject = (requestId: string) => {
    toast({
      title: "Request rejected", 
      description: `Verification request ${requestId} has been rejected`,
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "flagged":
        return <Badge variant="outline" className="border-destructive text-destructive">Flagged</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getInstitutionStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-muted-foreground mt-2">
          Manage verification requests, institutions, and system security settings
        </p>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Verification Requests
          </TabsTrigger>
          <TabsTrigger value="institutions" className="gap-2">
            <Building className="h-4 w-4" />
            Institutions
          </TabsTrigger>
          <TabsTrigger value="blacklist" className="gap-2">
            <Shield className="h-4 w-4" />
            Blacklisted Certificates
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            System Alerts
          </TabsTrigger>
        </TabsList>

        {/* Verification Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pending Verification Requests</CardTitle>
                  <CardDescription>
                    Review and approve or reject certificate verification requests
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Search requests..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verificationRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.studentName}</TableCell>
                      <TableCell>{request.institution}</TableCell>
                      <TableCell className="font-mono text-sm">{request.certificateId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 text-sm">{request.confidence}%</div>
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                request.confidence >= 90 ? 'bg-success' : 
                                request.confidence >= 70 ? 'bg-warning' : 'bg-destructive'
                              }`}
                              style={{ width: `${request.confidence}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1 text-success border-success hover:bg-success hover:text-success-foreground"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Institutions Tab */}
        <TabsContent value="institutions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Registered Institutions</CardTitle>
                  <CardDescription>
                    Manage institutions authorized to issue certificates
                  </CardDescription>
                </div>
                <Button className="gap-2" onClick={() => setShowAddInstitution(true)}>
                  <Plus className="h-4 w-4" />
                  Add Institution
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Certificates Issued</TableHead>
                    <TableHead>Verification Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institutions.map((institution) => (
                    <TableRow key={institution.id}>
                      <TableCell className="font-medium">{institution.name}</TableCell>
                      <TableCell>{institution.type}</TableCell>
                      <TableCell>{institution.certificatesIssued.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{institution.verificationRate}%</span>
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${institution.verificationRate}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getInstitutionStatusBadge(institution.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blacklist Tab */}
        <TabsContent value="blacklist" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Blacklisted Certificates</CardTitle>
                  <CardDescription>
                    Certificates flagged as fraudulent or invalid
                  </CardDescription>
                </div>
                <Button variant="destructive" className="gap-2" onClick={() => setShowAddBlacklist(true)}>
                  <Plus className="h-4 w-4" />
                  Add to Blacklist
                </Button>
      {/* Add Institution Dialog */}
      <Dialog open={showAddInstitution} onOpenChange={setShowAddInstitution}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Institution</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Institution Name" value={newInstitution.name} onChange={e => setNewInstitution(i => ({ ...i, name: e.target.value }))} />
            <Input placeholder="Type (University, College, etc.)" value={newInstitution.type} onChange={e => setNewInstitution(i => ({ ...i, type: e.target.value }))} />
            <select className="w-full border rounded p-2" value={newInstitution.status} onChange={e => setNewInstitution(i => ({ ...i, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <DialogFooter>
            <Button onClick={handleAddInstitution}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Blacklist Dialog */}
      <Dialog open={showAddBlacklist} onOpenChange={setShowAddBlacklist}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Blacklist</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Certificate ID" value={newBlacklist.certificateId} onChange={e => setNewBlacklist(b => ({ ...b, certificateId: e.target.value }))} />
            <Input placeholder="Reason" value={newBlacklist.reason} onChange={e => setNewBlacklist(b => ({ ...b, reason: e.target.value }))} />
            <Input placeholder="Reported By" value={newBlacklist.reportedBy} onChange={e => setNewBlacklist(b => ({ ...b, reportedBy: e.target.value }))} />
            <Input placeholder="Associated Institution" value={newBlacklist.associatedInstitution} onChange={e => setNewBlacklist(b => ({ ...b, associatedInstitution: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddBlacklist}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date Blacklisted</TableHead>
                    <TableHead>Associated Institution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blacklistedCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono text-sm">{cert.certificateId}</TableCell>
                      <TableCell>{cert.reason}</TableCell>
                      <TableCell>{cert.reportedBy}</TableCell>
                      <TableCell>{cert.dateBlacklisted}</TableCell>
                      <TableCell>{cert.associatedInstitution}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Alerts Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Monitoring</CardTitle>
              <CardDescription>
                Real-time system alerts and security notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">High Priority Alert</span>
                    <Badge variant="destructive" className="ml-auto">Critical</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Multiple fake certificates detected from "Fake University" - Immediate investigation required
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Detected 15 minutes ago • Auto-blocked 23 certificates
                  </p>
                </div>
                
                <div className="p-4 border border-warning rounded-lg bg-warning/5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="font-medium text-warning">Medium Priority Alert</span>
                    <Badge variant="outline" className="ml-auto border-warning text-warning">Warning</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    OCR confidence scores dropping below threshold for recent uploads
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Detected 2 hours ago • 12 certificates affected
                  </p>
                </div>
                
                <div className="p-4 border border-success rounded-lg bg-success/5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">System Status</span>
                    <Badge className="ml-auto bg-success text-success-foreground">Normal</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All systems operational - Database sync completed successfully
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last updated 5 minutes ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPortal;