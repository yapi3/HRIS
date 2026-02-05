import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, Clock, CheckCircle2, XCircle, AlertCircle, Calendar, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  members: string[];
  milestone: string;
  duration: string;
  status: "pending" | "approved" | "rejected" | "in-progress";
  createdDate: string;
  createdBy: string;
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Employee Portal Redesign",
    members: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez"],
    milestone: "Phase 1 - Design",
    duration: "3 months",
    status: "approved",
    createdDate: "2024-01-15",
    createdBy: "John Doe",
  },
  {
    id: "2",
    name: "HR Analytics Dashboard",
    members: ["David Kim", "Lisa Anderson"],
    milestone: "Data Collection",
    duration: "2 months",
    status: "in-progress",
    createdDate: "2024-01-20",
    createdBy: "Sarah Johnson",
  },
  {
    id: "3",
    name: "Onboarding Process Automation",
    members: ["Emily Rodriguez", "James Wilson"],
    milestone: "Requirements Gathering",
    duration: "4 months",
    status: "pending",
    createdDate: "2024-02-01",
    createdBy: "Michael Chen",
  },
  {
    id: "4",
    name: "Performance Review System",
    members: ["Sarah Johnson", "David Kim", "Maria Garcia"],
    milestone: "Development",
    duration: "6 months",
    status: "rejected",
    createdDate: "2024-01-28",
    createdBy: "John Doe",
  },
  {
    id: "5",
    name: "Training Management Platform",
    members: ["Michael Chen", "Lisa Anderson", "Emily Rodriguez"],
    milestone: "Testing Phase",
    duration: "5 months",
    status: "pending",
    createdDate: "2024-02-03",
    createdBy: "David Kim",
  },
];

// Available team members for selection
const availableMembers = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "Lisa Anderson",
  "James Wilson",
  "Maria Garcia",
  "Robert Taylor",
  "Jennifer Lee",
  "Christopher Brown",
];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    milestone: "",
    duration: "",
  });

  const handleAddMember = (member: string) => {
    if (!selectedMembers.includes(member)) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleRemoveMember = (member: string) => {
    setSelectedMembers(selectedMembers.filter(m => m !== member));
  };

  const handleCreateProject = () => {
    if (!formData.name || !formData.milestone || !formData.duration) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please add at least one team member");
      return;
    }

    const newProject: Project = {
      id: (projects.length + 1).toString(),
      name: formData.name,
      members: selectedMembers,
      milestone: formData.milestone,
      duration: formData.duration,
      status: "pending",
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: "John Doe",
    };

    setProjects([newProject, ...projects]);
    setIsDialogOpen(false);
    setFormData({ name: "", milestone: "", duration: "" });
    setSelectedMembers([]);
    toast.success("Project created successfully! Pending approval.");
  };

  const handleStatusChange = (projectId: string, newStatus: "approved" | "rejected") => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
    toast.success(`Project ${newStatus}!`);
  };

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const stats = [
    { label: "Total Projects", value: projects.length, color: "from-blue-500 to-cyan-500" },
    { label: "Pending Approval", value: projects.filter(p => p.status === "pending").length, color: "from-yellow-500 to-orange-500" },
    { label: "Approved", value: projects.filter(p => p.status === "approved").length, color: "from-green-500 to-emerald-500" },
    { label: "In Progress", value: projects.filter(p => p.status === "in-progress").length, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-500 mt-1">Manage and track project approvals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <Label>Team Members * ({selectedMembers.length} selected)</Label>
                <Select onValueChange={handleAddMember}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add team members" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map((member) => (
                      <SelectItem 
                        key={member} 
                        value={member}
                        disabled={selectedMembers.includes(member)}
                      >
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedMembers.map((member) => (
                      <Badge
                        key={member}
                        variant="secondary"
                        className="px-3 py-1 cursor-pointer hover:bg-red-100"
                        onClick={() => handleRemoveMember(member)}
                      >
                        {member}
                        <XCircle className="w-3 h-3 ml-2" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="milestone">Milestone *</Label>
                <Input
                  id="milestone"
                  value={formData.milestone}
                  onChange={(e) => setFormData({ ...formData, milestone: e.target.value })}
                  placeholder="e.g., Phase 1 - Planning"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Select 
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2 months">2 months</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="4 months">4 months</SelectItem>
                    <SelectItem value="5 months">5 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="9 months">9 months</SelectItem>
                    <SelectItem value="12 months">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCreateProject} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mb-4`}>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Projects Table */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Projects</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{project.members.length}</span>
                      <div className="group relative">
                        <button className="text-xs text-purple-600 hover:underline ml-1">
                          view
                        </button>
                        <div className="absolute left-0 top-6 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-3 w-48 z-10">
                          {project.members.map((member, idx) => (
                            <div key={idx} className="py-1">{member}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{project.milestone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{project.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{project.createdBy}</TableCell>
                  <TableCell className="text-sm text-gray-600">{project.createdDate}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(project.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(project.status)}
                      <span className="capitalize">{project.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {project.status === "pending" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-300 hover:bg-green-50"
                          onClick={() => handleStatusChange(project.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleStatusChange(project.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {project.status !== "pending" && (
                      <span className="text-sm text-gray-400">No actions</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
