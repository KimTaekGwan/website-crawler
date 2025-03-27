import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon, Trash2Icon } from "lucide-react";
import TagBadge from "@/components/tags/TagBadge";
import { Tag } from "@shared/schema";

export default function TagManager() {
  const { toast } = useToast();
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3B82F6");

  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  const createTagMutation = useMutation({
    mutationFn: (newTag: { name: string; color: string }) => 
      apiRequest('POST', '/api/tags', newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      setNewTagName("");
      toast({
        title: "Tag created",
        description: "Your new tag has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating tag",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteTagMutation = useMutation({
    mutationFn: (tagId: number) => 
      apiRequest('DELETE', `/api/tags/${tagId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      toast({
        title: "Tag deleted",
        description: "The tag has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting tag",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name is required",
        variant: "destructive",
      });
      return;
    }
    
    createTagMutation.mutate({
      name: newTagName.trim(),
      color: newTagColor
    });
  };

  return (
    <div className="py-6 px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tag Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create Tag</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTag} className="space-y-4">
                <div>
                  <label htmlFor="tagName" className="block text-sm font-medium text-gray-700">Tag Name</label>
                  <Input
                    id="tagName"
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter tag name"
                  />
                </div>
                
                <div>
                  <label htmlFor="tagColor" className="block text-sm font-medium text-gray-700">Tag Color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      id="tagColor"
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="w-12 h-8 p-0.5"
                    />
                    <Input
                      type="text"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                  <TagBadge name={newTagName || "Tag Preview"} color={newTagColor} />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createTagMutation.isPending}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Tag
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tag List</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-2">
                      <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
                      <div className="flex-1"></div>
                      <div className="h-8 w-8 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : tags?.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No tags found. Create your first tag.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tags?.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50">
                      <TagBadge name={tag.name} color={tag.color} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTagMutation.mutate(tag.id)}
                        disabled={deleteTagMutation.isPending}
                      >
                        <Trash2Icon className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
