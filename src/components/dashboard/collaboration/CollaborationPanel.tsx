
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Plus, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  avatarUrl?: string;
}

interface CollaborationPanelProps {
  formId: string;
  collaborators: Collaborator[];
  currentUserId: string;
  onAddCollaborator?: (email: string, role: Collaborator["role"]) => void;
  onUpdateCollaborator?: (id: string, role: Collaborator["role"]) => void;
  onRemoveCollaborator?: (id: string) => void;
}

export function CollaborationPanel({
  formId,
  collaborators,
  currentUserId,
  onAddCollaborator,
  onUpdateCollaborator,
  onRemoveCollaborator
}: CollaborationPanelProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Collaborator["role"]>("viewer");
  const { toast } = useToast();

  const handleAddCollaborator = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (onAddCollaborator) {
      onAddCollaborator(email, role);
      setEmail("");
      
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${email}`,
      });
    }
  };

  const handleRoleChange = (id: string, newRole: Collaborator["role"]) => {
    if (onUpdateCollaborator) {
      onUpdateCollaborator(id, newRole);
      
      toast({
        title: "Role updated",
        description: "Collaborator role has been updated",
      });
    }
  };

  const handleRemoveCollaborator = (id: string) => {
    if (onRemoveCollaborator) {
      onRemoveCollaborator(id);
      
      toast({
        title: "Collaborator removed",
        description: "Collaborator has been removed from this form",
      });
    }
  };

  const getRoleBadgeColor = (role: Collaborator["role"]) => {
    switch (role) {
      case "owner": return "bg-purple-100 text-purple-800";
      case "editor": return "bg-blue-100 text-blue-800";
      case "viewer": return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add collaborators</CardTitle>
          <CardDescription>
            Invite team members to collaborate on this form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-28">
                  {role.charAt(0).toUpperCase() + role.slice(1)} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRole("editor")}>Editor</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole("viewer")}>Viewer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleAddCollaborator}>
              <UserPlus className="h-4 w-4 mr-1" />
              Invite
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p><strong>Editor:</strong> Can edit form fields and view responses</p>
            <p><strong>Viewer:</strong> Can only view the form and responses</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Collaborators</CardTitle>
          <CardDescription>
            People with access to this form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={collaborator.avatarUrl} alt={collaborator.name} />
                    <AvatarFallback>
                      {collaborator.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center">
                      {collaborator.name}
                      {collaborator.id === currentUserId && (
                        <span className="ml-2 text-xs text-gray-500">(you)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{collaborator.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getRoleBadgeColor(collaborator.role)}>
                    {collaborator.role}
                  </Badge>
                  
                  {collaborator.id !== currentUserId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(collaborator.id, "editor")}
                          disabled={collaborator.role === "editor"}
                        >
                          Make editor
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(collaborator.id, "viewer")}
                          disabled={collaborator.role === "viewer"}
                        >
                          Make viewer
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRemoveCollaborator(collaborator.id)}
                          className="text-red-600"
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}

            {collaborators.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <UserPlus className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="font-medium">No collaborators yet</p>
                <p className="text-sm">Invite people to collaborate on this form</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
