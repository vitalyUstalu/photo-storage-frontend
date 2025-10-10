import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const Hashtags = () => {
  const queryClient = useQueryClient();
  const [newHashtag, setNewHashtag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: hashtags, isLoading } = useQuery({
    queryKey: ['hashtags'],
    queryFn: () => apiClient.getHashtags(),
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['hashtags-search', searchQuery],
    queryFn: () => apiClient.searchHashtags(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => apiClient.createHashtag(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hashtags'] });
      setNewHashtag('');
      toast.success('Hashtag created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create hashtag');
    },
  });

  const handleCreateHashtag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHashtag.trim()) {
      // Remove # if user included it
      const cleanName = newHashtag.trim().replace(/^#/, '');
      createMutation.mutate(cleanName);
    }
  };

  const displayHashtags = searchQuery ? searchResults : hashtags;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Hashtags</h1>
          <p className="text-muted-foreground">
            Manage and organize your photo hashtags
          </p>
        </div>

        {/* Create New Hashtag */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Create New Hashtag</CardTitle>
            <CardDescription>
              Add a new hashtag to organize your photos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateHashtag} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="new-hashtag" className="sr-only">
                  Hashtag name
                </Label>
                <Input
                  id="new-hashtag"
                  placeholder="Enter hashtag name (without #)"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={!newHashtag.trim() || createMutation.isPending}
                className="gradient-primary text-white shadow-medium hover:shadow-large transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Hashtags */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Search Hashtags</CardTitle>
            <CardDescription>
              Find existing hashtags in your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* All Hashtags */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>
              {searchQuery ? 'Search Results' : 'All Hashtags'}
            </CardTitle>
            <CardDescription>
              {searchQuery
                ? `Found ${displayHashtags?.length || 0} hashtags`
                : `You have ${hashtags?.length || 0} hashtags`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || isSearching ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-24" />
                ))}
              </div>
            ) : displayHashtags && displayHashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayHashtags.map((hashtag: { id: number; name: string }) => (
                  <Badge
                    key={hashtag.id}
                    variant="secondary"
                    className="text-sm px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                    onClick={() => window.location.href = `/?hashtag=${hashtag.name}`}
                  >
                    <Tag className="h-3 w-3 mr-1.5" />
                    {hashtag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {searchQuery ? 'No hashtags found' : 'No hashtags yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Hashtags;
