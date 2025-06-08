import mongoose from "mongoose";
import Blog from "../../models/Blogs.model.js";
import sendResponse from "../../helpers/sendResponse.js";

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, description, tags } = req.body;
    const image = req.file ? req.file.path : null; // Assuming the image is uploaded via multer

    // Validate the blog ID format
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return sendResponse(res, 400, null, true, "Invalid blog ID format.");
    }

    // Find the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return sendResponse(res, 404, null, true, "Blog not found.");
    }

    // Update the blog fields
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.image = image || blog.image; // Only update if a new image is provided
    if (tags) blog.tags = JSON.parse(tags); // Assuming tags are sent as a JSON string
    
    await blog.save();

    return sendResponse(res, 200, blog, false, "Blog updated successfully.");
  } catch (error) {
    console.error("Error updating blog:", error.message);
    return sendResponse(res, 500, null, true, `Server error: ${error.message}`);
  }
}