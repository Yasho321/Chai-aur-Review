import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { useCourseStore } from "@/stores/courseStore";
import { Plus, Trash2, FileText, Image } from "lucide-react";

export default function Feedback() {
  const { authUser } = useAuthStore();
  const { 
    feedbacks, 
    myFeedbacks,
    isLoading, 
    isSubmitting, 
    isDeleting,
    submitFeedback, 
    getFeedbackAsAdmin,
    getMyFeedback,
    deleteFeedback 
  } = useFeedbackStore();
  const { courses, getCourses } = useCourseStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    textContent: '',
    mediaFiles: []
  });
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    getCourses();
    getMyFeedback();
  }, [getCourses, getMyFeedback]);

  useEffect(() => {
    if (authUser?.role === 'admin' && selectedCourse) {
      getFeedbackAsAdmin(selectedCourse);
    }
  }, [authUser, selectedCourse, getFeedbackAsAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('courseId', formData.courseId);
      formDataToSend.append('textContent', formData.textContent);
      
      // Append media files
      for (let i = 0; i < formData.mediaFiles.length; i++) {
        formDataToSend.append('mediaFiles', formData.mediaFiles[i]);
      }

      await submitFeedback(formDataToSend);
      setFormData({ courseId: '', textContent: '', mediaFiles: [] });
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteFeedback(feedbackId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, mediaFiles: Array.from(e.target.files) });
  };

  const displayFeedbacks = authUser?.role === 'admin' ? feedbacks : myFeedbacks;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
            <p className="text-muted-foreground">
              {authUser?.role === 'admin' 
                ? 'View and manage course feedback from students.' 
                : 'Submit and manage your course feedback.'
              }
            </p>
          </div>

          <div className="flex gap-4">
            {authUser?.role === 'admin' && (
              <Select value={selectedCourse} onValueChange={setSelectedCourse} >
                <SelectTrigger className="w-48 text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id} >
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Submit Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit New Feedback</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="courseId">Course</Label>
                    <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="textContent">Feedback Content</Label>
                    <Textarea
                      id="textContent"
                      value={formData.textContent}
                      onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                      placeholder="Share your thoughts about the course..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="mediaFiles">Attach Files (Optional)</Label>
                    <Input
                      id="mediaFiles"
                      type="file"
                      multiple
                      accept="image/*,video/*,application/pdf"
                      onChange={handleFileChange}
                      className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded file:px-3 file:py-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can upload images, videos, or PDF files
                    </p>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Feedback List */}
        <div className="grid gap-6">
          {displayFeedbacks.map((feedback) => (
            <Card key={feedback._id} className="bg-card border-border shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">
                    {feedback.courseId?.title || 'Unknown Course'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">
                      {feedback.status}
                    </span>
                    {(authUser?.role === 'admin' || feedback.userId === authUser?.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(feedback._id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {authUser?.role === 'admin' && feedback.userId && (
                  <p className="text-sm text-muted-foreground">
                    By: {feedback.userId.name || feedback.userId.email}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{feedback.textContent}</p>
                
                {feedback.mediaFiles && feedback.mediaFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Attachments:</p>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {feedback.mediaFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          {file.fileType?.startsWith('image/') ? (
                            <Image className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                          <a 
                            href={file.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline truncate"
                          >
                            {file.fileName}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-4">
                  Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {displayFeedbacks.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {authUser?.role === 'admin' 
                ? 'No feedback available for the selected course'
                : 'No feedback submitted yet'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}