import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useCourseStore } from "@/stores/courseStore";
import { Plus, Trash2, Upload, FileText, Users as UsersIcon } from "lucide-react";

export default function Users() {
  const { authUser } = useAuthStore();
  const { 
    preRegisteredUsers, 
    isLoading, 
    isPreRegistering, 
    isDeleting,
    preRegisterUser,
    preRegisterCSV,
    preRegisterJSON,
    getPreRegisteredUsers,
    deleteUser 
  } = useUserStore();
  const { courses, getCourses } = useCourseStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCSVOpen, setIsCSVOpen] = useState(false);
  const [isJSONOpen, setIsJSONOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    courseIds: []
  });
  const [csvFile, setCSVFile] = useState(null);
  const [jsonData, setJsonData] = useState('');

  useEffect(() => {
    if (authUser?.role === 'admin') {
      getCourses();
      getPreRegisteredUsers();
    }
  }, [authUser, getCourses, getPreRegisteredUsers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await preRegisterUser(formData);
      setFormData({ email: '', courseIds: [] });
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('csvFile', csvFile);
      await preRegisterCSV(formDataToSend);
      setCSVFile(null);
      setIsCSVOpen(false);
    } catch (error) {
      console.error('CSV upload error:', error);
    }
  };

  const handleJSONUpload = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonData);
      await preRegisterJSON(parsedData);
      setJsonData('');
      setIsJSONOpen(false);
    } catch (error) {
      console.error('JSON upload error:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleCourseSelect = (courseId) => {
    const updatedCourses = formData.courseIds.includes(courseId)
      ? formData.courseIds.filter(id => id !== courseId)
      : [...formData.courseIds, courseId];
    setFormData({ ...formData, courseIds: updatedCourses });
  };

  if (authUser?.role !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground">Manage pre-registered users and enrollments.</p>
          </div>

          <div className="flex gap-2">
            {/* Single User Registration */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pre-Register User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Select Courses</Label>
                    <div className="grid gap-2 mt-2">
                      {courses.map((course) => (
                        <label key={course._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.courseIds.includes(course._id)}
                            onChange={() => handleCourseSelect(course._id)}
                            className="rounded"
                          />
                          <span className="text-sm">{course.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" disabled={isPreRegistering} className="w-full">
                    {isPreRegistering ? 'Registering...' : 'Pre-Register User'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* CSV Upload */}
            <Dialog open={isCSVOpen} onOpenChange={setIsCSVOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  CSV Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload CSV File</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCSVUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="csvFile">CSV File</Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCSVFile(e.target.files[0])}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      CSV should have columns: email, courseIds (comma-separated)
                    </p>
                  </div>

                  <Button type="submit" disabled={isPreRegistering || !csvFile} className="w-full">
                    {isPreRegistering ? 'Uploading...' : 'Upload CSV'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* JSON Upload */}
            <Dialog open={isJSONOpen} onOpenChange={setIsJSONOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  JSON Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload JSON Data</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleJSONUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="jsonData">JSON Data</Label>
                    <Textarea
                      id="jsonData"
                      value={jsonData}
                      onChange={(e) => setJsonData(e.target.value)}
                      placeholder={`{
  "users": [
    {
      "email": "user@example.com",
      "courseIds": ["courseId1", "courseId2"]
    }
  ]
}`}
                      className="min-h-48 font-mono text-sm"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isPreRegistering || !jsonData} className="w-full">
                    {isPreRegistering ? 'Processing...' : 'Process JSON'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-4">
          {preRegisteredUsers.map((user) => (
            <Card key={user._id} className="bg-card border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Registered by {user.registeredBy?.name || user.registeredBy?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.courseIds?.map((course) => (
                        <span 
                          key={course._id || course}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {course.title || course}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.hasSignedUp 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-warning text-warning-foreground'
                    }`}>
                      {user.hasSignedUp ? 'Signed Up' : 'Pending'}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {preRegisteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No pre-registered users found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}