"use client";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { fetchPosts } from "@/lib/fetch";
import { IPost } from "@/model/Post";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Share2, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export default function Page() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const response = await fetchPosts({ status: "published", limit: 6 });
        setPosts(response.posts);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {loading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center min-h-[50vh] text-destructive">
                  {error}
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">Latest Posts</h1>
                  <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {posts.slice(0, 3).map((post) => (
                      <PostCard key={post._id?.toString()} post={post} />
                    ))}
                  </div>
                  <div className="min-h-[50vh] flex-1 rounded-xl bg-card p-4 md:min-h-min">
                    <h2 className="text-xl font-bold mb-4">More Content</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                      {posts.slice(3).map((post) => (
                        <PostCard key={post._id?.toString()} post={post} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

interface PostCardProps {
  post: IPost;
}

function PostCard({ post }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = post.images && post.images.length > 1;

  const nextImage = () => {
    if (post.images) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const prevImage = () => {
    if (post.images) {
      setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {post.images && post.images.length > 0 && (
        <div className="relative aspect-video w-full overflow-hidden">
          {/* Image Carousel */}
          <div className="relative h-full w-full">
            <img
              src={post.images[currentImageIndex].url}
              alt={post.images[currentImageIndex].altText || "Post image"}
              className="object-cover w-full h-full transition-all duration-300"
            />
            
            {hasMultipleImages && (
              <>
                {/* Use shadcn Button components for navigation */}
                <Button
                  onClick={prevImage}
                  size="icon"
                  variant="secondary"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={nextImage}
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Image counter using shadcn Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute bottom-2 right-2 bg-background/70 backdrop-blur-sm"
                >
                  {currentImageIndex + 1} / {post.images.length}
                </Badge>
                
                {/* Image pagination indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex ? "w-4 bg-primary" : "w-1.5 bg-muted"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{post.author.toString().substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-lg">
          {post.category} - {post.tags.join(", ")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="line-clamp-3 text-sm">{post.content}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between text-muted-foreground text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            {post.likes.length}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {post.comments.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            {post.shares}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {post.views}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}