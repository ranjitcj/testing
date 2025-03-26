// // import { NextApiRequest, NextApiResponse } from 'next';
// // import { connectToDatabase } from '@/lib/mongodb'; // Your database connection utility
// // import { ObjectId } from 'mongodb';

// // export default async function handler(
// //   req: NextApiRequest, 
// //   res: NextApiResponse
// // ) {
// //   const { method } = req;
// //   const { userId } = req.query;

// //   // Validate userId
// //   if (!userId || typeof userId !== 'string') {
// //     return res.status(400).json({ 
// //       error: 'Invalid user ID provided' 
// //     });
// //   }

// //   try {
// //     // Connect to database
// //     const { db } = await connectToDatabase();
    
// //     // Determine the collection
// //     const usersCollection = db.collection('users');

// //     switch (method) {
// //       case 'GET':
// //         try {
// //           // Convert string to ObjectId
// //           const userObjectId = new ObjectId(userId);

// //           // Find user by ID, exclude sensitive fields
// //           const user = await usersCollection.findOne(
// //             { _id: userObjectId },
// //             { 
// //               projection: { 
// //                 password: 0,  // Always exclude password
// //                 resetToken: 0,
// //                 email: 0  // Optionally exclude email
// //               } 
// //             }
// //           );

// //           // Handle user not found
// //           if (!user) {
// //             return res.status(404).json({ 
// //               error: 'User not found' 
// //             });
// //           }

// //           // Transform _id to string for JSON serialization
// //           const formattedUser = {
// //             ...user,
// //             _id: user._id.toString()
// //           };

// //           return res.status(200).json(formattedUser);

// //         } catch (findError) {
// //           console.error('Error finding user:', findError);
// //           return res.status(500).json({ 
// //             error: 'Error retrieving user information' 
// //           });
// //         }

// //       default:
// //         res.setHeader('Allow', ['GET']);
// //         return res.status(405).end(`Method ${method} Not Allowed`);
// //     }
// //   } catch (connectionError) {
// //     console.error('Database connection error:', connectionError);
// //     return res.status(500).json({ 
// //       error: 'Database connection failed' 
// //     });
// //   }
// // }
// "use server"

// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: NextRequest, 
//   { params }: { params: { userId: string } }
// ) {
//   // Connect to the database
//   await dbConnect();
  
//   try {
//     const userId = params.userId;
//     const decodedUserId = decodeURIComponent(userId);
//     const user = await UserModel.findOne({ _id: decodedUserId });

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, user },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error verifying user:", error);
//     return NextResponse.json(
//       { success: false, message: "Error verifying user" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

type RouteParams = {
  params: {
    userId: string;
  };
};

export async function GET(
  _request: NextRequest, 
  context: RouteParams
) {
  // Connect to the database
  await dbConnect();
  
  try {
    // Destructure params safely
    const { userId } = context.params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const decodedUserId = decodeURIComponent(userId);
    const user = await UserModel.findOne({ _id: decodedUserId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}