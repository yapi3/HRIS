import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Upload, 
  FileText, 
  Download, 
  Star, 
  TrendingUp,
  Award,
  Target,
  CheckCircle2,
  Trash2,
  Eye,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface DocumentManagementProps {
  onPointsEarned: (points: number) => void;
}

interface Document {
  id: string;
  name: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  pointsEarned: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  target: number;
  isCompleted: boolean;
}

const initialDocuments: Document[] = [
  {
    id: "1",
    name: "Employee Handbook 2024.pdf",
    category: "Policy",
    uploadedBy: "John Doe",
    uploadDate: "2024-02-01",
    size: "2.4 MB",
    pointsEarned: 15,
  },
  {
    id: "2",
    name: "Q1 Performance Reviews.xlsx",
    category: "Performance",
    uploadedBy: "Sarah Johnson",
    uploadDate: "2024-02-03",
    size: "1.8 MB",
    pointsEarned: 20,
  },
  {
    id: "3",
    name: "Training Certificate - Safety.pdf",
    category: "Training",
    uploadedBy: "Michael Chen",
    uploadDate: "2024-02-02",
    size: "890 KB",
    pointsEarned: 25,
  },
  {
    id: "4",
    name: "Benefits Package 2024.pdf",
    category: "Benefits",
    uploadedBy: "Emily Rodriguez",
    uploadDate: "2024-01-28",
    size: "1.2 MB",
    pointsEarned: 18,
  },
  {
    id: "5",
    name: "Compliance Report Q4.docx",
    category: "Compliance",
    uploadedBy: "David Kim",
    uploadDate: "2024-01-30",
    size: "756 KB",
    pointsEarned: 22,
  },
];

const initialAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Upload",
    description: "Upload your first document",
    points: 10,
    progress: 1,
    target: 1,
    isCompleted: true,
  },
  {
    id: "2",
    title: "Document Master",
    description: "Upload 10 documents",
    points: 50,
    progress: 5,
    target: 10,
    isCompleted: false,
  },
  {
    id: "3",
    title: "Organized Pro",
    description: "Upload documents in 5 different categories",
    points: 75,
    progress: 5,
    target: 5,
    isCompleted: true,
  },
  {
    id: "4",
    title: "Weekly Warrior",
    description: "Upload at least one document every week for a month",
    points: 100,
    progress: 2,
    target: 4,
    isCompleted: false,
  },
];

export function DocumentManagement({ onPointsEarned }: DocumentManagementProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    file: null as File | null,
  });

  const handleFileUpload = () => {
    if (!formData.name || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const pointsEarned = Math.floor(Math.random() * 20) + 10;
    
    const newDocument: Document = {
      id: (documents.length + 1).toString(),
      name: formData.name,
      category: formData.category,
      uploadedBy: "John Doe",
      uploadDate: new Date().toISOString().split('T')[0],
      size: formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : "1.5 MB",
      pointsEarned,
    };

    setDocuments([newDocument, ...documents]);
    onPointsEarned(pointsEarned);
    
    // Update achievements
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.id === "2" && !achievement.isCompleted) {
        const newProgress = achievement.progress + 1;
        if (newProgress >= achievement.target) {
          onPointsEarned(achievement.points);
          toast.success(`Achievement Unlocked: ${achievement.title}! +${achievement.points} points`);
          return { ...achievement, progress: newProgress, isCompleted: true };
        }
        return { ...achievement, progress: newProgress };
      }
      return achievement;
    });
    setAchievements(updatedAchievements);

    setIsDialogOpen(false);
    setFormData({ name: "", category: "", file: null });
    
    toast.success(`Document uploaded successfully! +${pointsEarned} points earned`, {
      icon: <Award className="w-5 h-5 text-purple-600" />,
    });
  };

  const handleDownload = (doc: Document) => {
    const downloadPoints = 5;
    onPointsEarned(downloadPoints);
    toast.success(`Downloaded ${doc.name}! +${downloadPoints} points`);
  };

  const handleView = (doc: Document) => {
    toast.info(`Viewing ${doc.name}`);
  };

  const handleDelete = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(documents.filter(d => d.id !== docId));
    toast.success(`Deleted ${doc?.name}`);
  };

  const totalPoints = documents.reduce((sum, doc) => sum + doc.pointsEarned, 0);
  const completedAchievements = achievements.filter(a => a.isCompleted).length;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Policy: "bg-blue-100 text-blue-700 border-blue-200",
      Contract: "bg-purple-100 text-purple-700 border-purple-200",
      Performance: "bg-green-100 text-green-700 border-green-200",
      Training: "bg-orange-100 text-orange-700 border-orange-200",
      Benefits: "bg-pink-100 text-pink-700 border-pink-200",
      Compliance: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-500 mt-1">Upload and manage documents to earn points</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="docName">Document Name *</Label>
                <Input
                  id="docName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Employee Contract.pdf"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Benefits">Benefits</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                />
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-700">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Earn 10-30 points per upload!</span>
                </div>
              </div>
              <Button onClick={handleFileUpload} className="w-full bg-purple-600 hover:bg-purple-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload & Earn Points
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Points Earned</p>
              <p className="text-4xl font-bold mt-2">{totalPoints}</p>
            </div>
            <Award className="w-12 h-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Documents Uploaded</p>
              <p className="text-4xl font-bold mt-2">{documents.length}</p>
            </div>
            <FileText className="w-12 h-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Achievements Unlocked</p>
              <p className="text-4xl font-bold mt-2">{completedAchievements}/{achievements.length}</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Documents</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Points Earned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(doc.category)}>
                          {doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{doc.uploadedBy}</TableCell>
                      <TableCell className="text-sm text-gray-600">{doc.uploadDate}</TableCell>
                      <TableCell className="text-sm text-gray-600">{doc.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-purple-600 font-semibold">
                          <Star className="w-4 h-4 fill-purple-600" />
                          <span>+{doc.pointsEarned}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleView(doc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(doc.id)}
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
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`p-6 ${achievement.isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {achievement.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Target className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{achievement.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-purple-600 font-bold">
                      <Award className="w-5 h-5" />
                      <span>{achievement.points} pts</span>
                    </div>
                  </div>
                  {!achievement.isCompleted && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.target}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                  {achievement.isCompleted && (
                    <Badge className="mt-2 bg-green-600">Completed</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
