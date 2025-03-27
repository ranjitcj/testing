// "use client";

// import React from 'react';
// import { AppSidebar } from "@/components/app-sidebar";
// import { SiteHeader } from "@/components/site-header";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { BadgeCheck, Grid, Bookmark, Heart, mess } from "lucide-react";
// import { useSession } from "next-auth/react";

// // Define types for posts
// type Post = {
//   id: string;
//   imageUrl: string;
//   likes: number;
//   comments: number;
// };

// const ProfilePage: React.FC = () => {
//   const { data: session } = useSession();
//   const user = session?.user;

//   // Mock posts data (in a real app, this would come from an API)
//   const posts: Post[] = [
//     { id: '1', imageUrl: '/api/placeholder/300/300', likes: 42, comments: 5 },
//     { id: '2', imageUrl: '/api/placeholder/300/300', likes: 78, comments: 12 },
//     { id: '3', imageUrl: '/api/placeholder/300/300', likes: 23, comments: 3 },
//     // Add more posts as needed
//   ];

//   if (!user) {
//     return <div>Please log in to view your profile</div>;
//   }

//   return (
//     <div className="flex min-h-screen">
//       <AppSidebar />
      
//       <main className="flex-1 bg-gray-50">
//         <SiteHeader />
        
//         <div className="container mx-auto px-4 py-8">
//           {/* Profile Header */}
//           <div className="flex items-center space-x-8 mb-8">
//             <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
//               <AvatarImage 
//                 src={user.image || `/api/placeholder/150/150`} 
//                 alt={`${user.username}'s profile`} 
//               />
//               <AvatarFallback>{user.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
//             </Avatar>
            
//             <div className="flex-1">
//               <div className="flex items-center space-x-4">
//                 <h1 className="text-2xl font-bold">{user.username}</h1>
//                 {user.role === 'student' && (
//                   <BadgeCheck className="text-blue-500" />
//                 )}
//               </div>
//               <p className="text-gray-600 mt-1">
//                 {user.role === 'student' ? 'Student' : 'Teacher'}
//               </p>
              
//               <div className="flex space-x-6 mt-4">
//                 <div>
//                   <span className="font-bold">{posts.length}</span> posts
//                 </div>
//                 <div>
//                   <span className="font-bold">150</span> followers
//                 </div>
//                 <div>
//                   <span className="font-bold">200</span> following
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Profile Tabs */}
//           <Tabs defaultValue="posts" className="w-full">
//             <TabsList className="grid w-full grid-cols-3 mb-4">
//               <TabsTrigger value="posts">
//                 <Grid className="mr-2 size-4" /> Posts
//               </TabsTrigger>
//               <TabsTrigger value="saved">
//                 <Bookmark className="mr-2 size-4" /> Saved
//               </TabsTrigger>
//               <TabsTrigger value="liked">
//                 <Heart className="mr-2 size-4" /> Liked
//               </TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="posts">
//               <div className="grid grid-cols-3 gap-2">
//                 {posts.map((post) => (
//                   <Card key={post.id} className="overflow-hidden">
//                     <CardContent className="p-0">
//                       <img 
//                         src={post.imageUrl} 
//                         alt={`Post ${post.id}`} 
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                         <div className="flex space-x-4 text-white">
//                           <div className="flex items-center">
//                             <Heart className="mr-2" />
//                             {post.likes}
//                           </div>
//                           <div className="flex items-center">
//                             <MessageCircle className="mr-2" />
//                             {post.comments}
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="saved">
//               <p>No saved posts yet.</p>
//             </TabsContent>
            
//             <TabsContent value="liked">
//               <p>No liked posts yet.</p>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProfilePage;