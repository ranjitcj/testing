import axios from 'axios';
import { IPost } from '@/model/Post'; // Adjust path as needed

// Base API URL - replace with your actual API URL
const API_URL = '/api';

// Type for post filtering options
export interface PostFilters {
  category?: string;
  tag?: string;
  author?: string;
  status?: 'draft' | 'published' | 'archived';
  limit?: number;
  page?: number;
  searchQuery?: string;
}

// Type for API response
export interface PostsResponse {
  posts: IPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch posts with optional filtering
 */
export const fetchPosts = async (filters: PostFilters = {}): Promise<PostsResponse> => {
  try {
    const response = await axios.get(`${API_URL}/post`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Fetch a single post by ID
 */
export const fetchPostById = async (postId: string): Promise<IPost> => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}`);
    return response.data.post;
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    throw error;
  }
};

/**
 * Like a post
 */
export const likePost = async (postId: string): Promise<IPost> => {
  try {
    const response = await axios.post(`${API_URL}/posts/${postId}/like`);
    return response.data.post;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

/**
 * Add a comment to a post
 */
export const addComment = async (postId: string, content: string): Promise<IPost> => {
  try {
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content });
    return response.data.post;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Increment post views
 */
export const incrementViews = async (postId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/posts/${postId}/view`);
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};