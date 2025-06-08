import mongoose from "mongoose";
import Blog from "../../models/Blogs.model.js";
import sendResponse from "../../helpers/sendResponse.js";

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Validate the blog ID format
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return sendResponse(res, 400, null, true, "Invalid blog ID format.");
    }

    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      return sendResponse(res, 404, null, true, "Blog not found.");
    }

    return sendResponse(res, 200, null, false, "Blog deleted successfully.");
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    return sendResponse(res, 500, null, true, `Server error: ${error.message}`);
  }
};