import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search, Plus, Mail, Phone, MapPin, Eye, Edit, Trash2, Paperclip, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: "active" | "inactive";
  joinDate: string;
  location: string;
  benefits: string;
  amount: string;
  attachment: string | null;
}

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 234-567-8901",
    department: "Engineering",
    position: "Senior Developer",
    status: "active",
    joinDate: "2022-01-15",
    location: "New York, NY",
    benefits: "Health Insurance, 401k",
    amount: "$5,000",
    attachment: "benefits_sarah.pdf",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@company.com",
    phone: "+1 234-567-8902",
    department: "Marketing",
    position: "Marketing Manager",
    status: "active",
    joinDate: "2021-06-20",
    location: "San Francisco, CA",
    benefits: "Health Insurance, Stock Options",
    amount: "$7,500",
    attachment: "benefits_michael.pdf",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@company.com",
    phone: "+1 234-567-8903",
    department: "HR",
    position: "HR Specialist",
    status: "active",
    joinDate: "2023-03-10",
    location: "Austin, TX",
    benefits: "Health Insurance, Dental",
    amount: "$4,200",
    attachment: null,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.k@company.com",
    phone: "+1 234-567-8904",
    department: "Finance",
    position: "Financial Analyst",
    status: "active",
    joinDate: "2022-08-05",
    location: "Chicago, IL",
    benefits: "Health Insurance, 401k, Dental",
    amount: "$6,000",
    attachment: "benefits_david.pdf",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@company.com",
    phone: "+1 234-567-8905",
    department: "Engineering",
    position: "UX Designer",
    status: "inactive",
    joinDate: "2020-11-12",
    location: "Seattle, WA",
    benefits: "Health Insurance",
    amount: "$3,500",
    attachment: null,
  },
];

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    location: "",
    benefits: "",
    amount: "",
    attachment: null as File | null,
  });

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEmployee = () => {
    if (!formData.name || !formData.email || !formData.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newEmployee: Employee = {
      id: (employees.length + 1).toString(),
      ...formData,
      status: "active",
      joinDate: new Date().toISOString().split('T')[0],
      attachment: formData.attachment ? formData.attachment.name : null,
    };

    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Employee added successfully!");
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee) return;

    if (!formData.name || !formData.email || !formData.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id
        ? {
            ...emp,
            ...formData,
            attachment: formData.attachment ? formData.attachment.name : emp.attachment,
          }
        : emp
    );

    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
    resetForm();
    toast.success("Employee updated successfully!");
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      location: employee.location,
      benefits: employee.benefits,
      amount: employee.amount,
      attachment: null,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const employee = employees.find((emp) => emp.id === id);
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast.success(`Deleted ${employee?.name}`);
  };

  const handleViewDetails = (employee: Employee) => {
    toast.info(`Viewing details for ${employee.name}`);
  };

  const handleDownloadAttachment = (attachment: string) => {
    toast.success(`Downloading ${attachment}`);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      location: "",
      benefits: "",
      amount: "",
      attachment: null,
    });
  };

  const stats = [
    { label: "Total Employees", value: employees.length, color: "from-blue-500 to-cyan-500" },
    { label: "Active", value: employees.filter(e => e.status === "active").length, color: "from-green-500 to-emerald-500" },
    { label: "Inactive", value: employees.filter(e => e.status === "inactive").length, color: "from-gray-500 to-gray-400" },
    { label: "Departments", value: new Set(employees.map(e => e.department)).size, color: "from-purple-500 to-pink-500" },
  ];

  const EmployeeFormFields = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 234-567-8900"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="New York, NY"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Department *</Label>
          <Select 
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Software Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="benefits">Benefits</Label>
          <Input
            id="benefits"
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            placeholder="Health Insurance, 401k"
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="$5,000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="attachment">Attachment</Label>
        <Input
          id="attachment"
          type="file"
          onChange={(e) => setFormData({ ...formData, attachment: e.target.files?.[0] || null })}
        />
        {selectedEmployee?.attachment && !formData.attachment && (
          <p className="text-sm text-gray-500 mt-1">Current: {selectedEmployee.attachment}</p>
        )}
      </div>

      <Button onClick={onSubmit} className="w-full bg-purple-600 hover:bg-purple-700">
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Employees</h2>
          <p className="text-gray-500 mt-1">Manage your workforce</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <EmployeeFormFields onSubmit={handleAddEmployee} submitLabel="Add Employee" />
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

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search employees by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Employee Table */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Employees</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Benefits</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{employee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.department}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{employee.position}</TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-[200px]">
                    <div className="truncate" title={employee.benefits}>
                      {employee.benefits}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{employee.amount.replace('$', '')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {employee.attachment ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => handleDownloadAttachment(employee.attachment!)}
                      >
                        <Paperclip className="w-3 h-3 mr-1" />
                        <span className="text-xs">Download</span>
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">No file</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewDetails(employee)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(employee)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(employee.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <EmployeeFormFields onSubmit={handleEditEmployee} submitLabel="Update Employee" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
