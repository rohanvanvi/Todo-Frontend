import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesUserIsMemberQueryFn } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";

const WorkspaceSelection = () => {
  const navigate = useNavigate();
  const { onOpen } = useCreateWorkspaceDialog();

  const { data, isPending } = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const workspaces = data?.workspaces || [];

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Select a Workspace</CardTitle>
          <CardDescription>
            Choose a workspace to continue or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workspaces.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {workspaces.map((workspace) => (
                  <Button
                    key={workspace._id}
                    variant="outline"
                    className="h-auto p-4 justify-start"
                    onClick={() => navigate(`/workspace/${workspace._id}`)}
                  >
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          {workspace.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{workspace.name}</span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No workspaces found</p>
              </div>
            )}
            <Button onClick={onOpen} className="w-full">
              Create New Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceSelection; 