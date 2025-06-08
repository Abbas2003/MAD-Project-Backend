import sendResponse from '../../helpers/sendResponse.js';
import Blog from '../../models/Blogs.model.js';

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, blogs, false, "Blogs retrieved successfully");
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    return sendResponse(res, 500, null, true, `Server error: ${error.message}`);
  }
};
