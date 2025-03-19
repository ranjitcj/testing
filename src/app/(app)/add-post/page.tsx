// "use client";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SiteHeader } from "@/components/site-header";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { useState } from "react";
// import { Upload } from "lucide-react";
// import { useSession } from "next-auth/react";

// export default function AddPost() {
//   const { data: session } = useSession();
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.result) {
//           setImage(reader.result.toString());
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     if (!session?.user?._id) {
//       // Handle not logged in state
//       console.error("User not authenticated");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const postData = {
//         author: session.user.username,
//         content,
//         image,
//         likes: [],
//         comments: [],
//       };

//       // API call to create post
//       const response = await fetch("/api/add-post", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(postData),
//       });

//       if (response.ok) {
//         // Reset form
//         setContent("");
//         setImage("");
//         // Add success notification or redirect
//       } else {
//         // Handle error
//         console.error("Failed to create post");
//       }
//     } catch (error) {
//       console.error("Error creating post:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="[--header-height:calc(theme(spacing.14))]">
//       <SidebarProvider className="flex flex-col">
//         <SiteHeader />
//         <div className="flex flex-1">
//           <AppSidebar />
//           <SidebarInset>
//             <div className="flex items-center justify-center w-full h-full py-8">
//               <div className="container max-w-2xl mx-auto">
//                 <Card className="shadow-lg">
//                   <CardHeader>
//                     <CardTitle>Create New Post</CardTitle>
//                   </CardHeader>
//                   <form onSubmit={handleSubmit}>
//                     <CardContent className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="content">What's on your mind?</Label>
//                         <Textarea
//                           id="content"
//                           placeholder="Share your thoughts..."
//                           className="min-h-32"
//                           value={content}
//                           onChange={(e) => setContent(e.target.value)}
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="image">Add an image</Label>
//                         <div className="flex items-center gap-2">
//                           <label
//                             htmlFor="image-upload"
//                             className="flex h-10 items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent hover:text-accent-foreground"
//                           >
//                             <Upload className="mr-2 h-4 w-4" />
//                             Upload
//                           </label>
//                           <input
//                             id="image-upload"
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={handleImageChange}
//                           />
//                           {image && (
//                             <span className="text-sm text-muted-foreground">
//                               Image selected
//                             </span>
//                           )}
//                         </div>

//                         {image && (
//                           <div className="mt-2 relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
//                             <img
//                               src={image}
//                               alt="Preview"
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>

//                     <CardFooter className="flex justify-end">
//                       <Button
//                         type="submit"
//                         disabled={isSubmitting || (!content && !image)}
//                       >
//                         {isSubmitting ? "Posting..." : "Post"}
//                       </Button>
//                     </CardFooter>
//                   </form>
//                 </Card>
//               </div>
//             </div>
//           </SidebarInset>
//         </div>
//       </SidebarProvider>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ImagePostPage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!image) {
  //     setError("Please select an image to upload");
  //     return;
  //   }

  //   if (!description.trim()) {
  //     setError("Please add a description for your image");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setError(null);
    
  //   try {
  //     // This is where you would typically implement your actual API call
  //     // For example using FormData and fetch:
      
  //     // const formData = new FormData();
  //     // formData.append("image", image);
  //     // formData.append("description", description);
  //     // const response = await fetch("/api/post-image", {
  //     //   method: "POST",
  //     //   body: formData,
  //     // });
      
  //     // Simulating API call with a timeout
  //     await new Promise(resolve => setTimeout(resolve, 1500));
      
  //     setSuccess(true);
  //     setDescription("");
  //     setImage(null);
  //     setPreviewUrl(null);
  //   } catch (err) {
  //     setError("Failed to upload image. Please try again.");
  //     console.error(err);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!image && !description.trim()) {
    setError("Please add an image or description for your post");
    return;
  }

  setIsSubmitting(true);
  setError(null);
  
  try {
    let imageUrl;
    
    // Upload image if one was selected
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      
      const imageResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!imageResponse.ok) {
        const errorData = await imageResponse.json();
        throw new Error(errorData.error || "Failed to upload image");
      }
      
      const imageData = await imageResponse.json();
      imageUrl = imageData.url;
    }
    
    // Create post
    const postResponse = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: description.trim() || undefined,
        image: imageUrl,
      }),
    });
    
    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      throw new Error(errorData.error || "Failed to create post");
    }
    
    setSuccess(true);
    setDescription("");
    setImage(null);
    setPreviewUrl(null);
  } catch (err: any) {
    setError(err.message || "Failed to create post. Please try again.");
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};
  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setImage(null);
    setPreviewUrl(null);
    setDescription("");
  };

  return (
    <div className="container py-10 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Post an Image</CardTitle>
          <CardDescription>Share your image with a description</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4 text-center">
              <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-medium text-lg">Image Posted Successfully!</h3>
              <p className="text-gray-500">Your image has been uploaded and shared.</p>
              <Button onClick={resetForm}>Post Another Image</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-50 text-center" onClick={() => document.getElementById("image")?.click()}>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="mx-auto max-h-64 rounded-md" 
                      />
                      <p className="text-sm text-gray-500">Click to change image</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Click to select an image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your image..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </form>
          )}
        </CardContent>
        {!success && (
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Post Image"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}