import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { PhotoCard } from '@/components/PhotoCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Gallery = () => {
  const [selectedHashtag, setSelectedHashtag] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: photos, isLoading: photosLoading } = useQuery({
    queryKey: ['photos', selectedHashtag],
    queryFn: () => apiClient.getPhotos(selectedHashtag),
  });

  const { data: hashtags, isLoading: hashtagsLoading } = useQuery({
    queryKey: ['hashtags'],
    queryFn: () => apiClient.getHashtags(),
  });

  const filteredHashtags = hashtags?.filter((tag: { name: string }) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHashtagClick = (tagName: string) => {
    setSelectedHashtag(selectedHashtag === tagName ? undefined : tagName);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Your Photos</h1>
          <p className="text-muted-foreground">
            Browse and organize your photo collection
          </p>
        </div>

        {/* Hashtag Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Filter by Hashtag</h2>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {hashtagsLoading ? (
            <div className="flex gap-2 flex-wrap">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {selectedHashtag && (
                <Badge
                  variant="default"
                  className="cursor-pointer gap-1.5 pl-3 pr-2"
                  onClick={() => setSelectedHashtag(undefined)}
                >
                  #{selectedHashtag}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filteredHashtags?.map((tag: { id: number; name: string }) => (
                <Badge
                  key={tag.id}
                  variant={selectedHashtag === tag.name ? 'default' : 'secondary'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                  onClick={() => handleHashtagClick(tag.name)}
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Photo Grid */}
        {photosLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo: any) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No photos found</h3>
            <p className="text-muted-foreground mb-6">
              {selectedHashtag
                ? `No photos with hashtag #${selectedHashtag}`
                : 'Start by uploading your first photo'}
            </p>
            <Button asChild>
              <a href="/upload">Upload Photo</a>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Gallery;
