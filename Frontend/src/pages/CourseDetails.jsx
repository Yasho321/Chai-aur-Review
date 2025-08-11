import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, UserCheck, UserX } from "lucide-react";
import { useCourseStore } from "../stores/courseStore";
import { useAuthStore } from "../stores/authStore";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { courseUsers, getCourseUsers, isLoading, courses } = useCourseStore();
  const [currentCourse, setCurrentCourse] = useState(null);

  useEffect(() => {
    if (courseId) {
      getCourseUsers(courseId);
    }
  }, [courseId, getCourseUsers]);

  useEffect(() => {
    if (courses.length > 0 && courseId) {
      const course = courses.find(c => c._id === courseId);
      setCurrentCourse(course);
    }
  }, [courses, courseId]);

  if (!authUser || authUser.role !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>

        {currentCourse && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{currentCourse.title}</CardTitle>
              <p className="text-muted-foreground">{currentCourse.description}</p>
            </CardHeader>
          </Card>
        )}

        {courseUsers && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Users with Feedback</p>
                    <p className="text-3xl font-bold text-foreground">{courseUsers.usersWithFeedback?.length || 0}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Signed Up (No Feedback)</p>
                    <p className="text-3xl font-bold text-foreground">{courseUsers.signedUpButNoFeedback?.length || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pre-registered Only</p>
                    <p className="text-3xl font-bold text-foreground">{courseUsers.preRegisteredButNotSignedUp?.length || 0}</p>
                  </div>
                  <UserX className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="with-feedback" className="space-y-4">
          <TabsList>
            <TabsTrigger value="with-feedback">Users with Feedback</TabsTrigger>
            <TabsTrigger value="no-feedback">Signed Up (No Feedback)</TabsTrigger>
            <TabsTrigger value="pre-registered">Pre-registered Only</TabsTrigger>
          </TabsList>

          <TabsContent value="with-feedback">
            <Card>
              <CardHeader>
                <CardTitle>Users Who Submitted Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {courseUsers?.usersWithFeedback?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Media Files</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseUsers.usersWithFeedback.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">{user.userId.name}</TableCell>
                          <TableCell>{user.userId.email}</TableCell>
                          <TableCell className="max-w-xs truncate">{user.textContent}</TableCell>
                          <TableCell>
                            {user.mediaFiles?.length > 0 ? (
                              <Badge variant="secondary">{user.mediaFiles.length} files</Badge>
                            ) : (
                              <span className="text-muted-foreground">No files</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'SUBMITTED' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No users have submitted feedback yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="no-feedback">
            <Card>
              <CardHeader>
                <CardTitle>Users Signed Up But No Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {courseUsers?.signedUpButNoFeedback?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseUsers.signedUpButNoFeedback.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No signed up users without feedback.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pre-registered">
            <Card>
              <CardHeader>
                <CardTitle>Pre-registered Users (Not Signed Up)</CardTitle>
              </CardHeader>
              <CardContent>
                {courseUsers?.preRegisteredButNotSignedUp?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Pre-registered At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseUsers.preRegisteredButNotSignedUp.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No pre-registered users.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}