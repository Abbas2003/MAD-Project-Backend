import sendResponse from '../../helpers/sendResponse.js';
import Blog from '../../models/Blogs.model.js';
import sanitizeHtml from '../../utils/sanitizeHtml.js'; 

export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null; 
    const tags = JSON.parse(req.body.tags);


    if (!title || !description) {
      return sendResponse(res, 400, null, true, "Title and description are required.");
    }

    // Sanitize the description content (the HTML from the editor)
    const sanitizedDescription = sanitizeHtml(description);

    const blog = new Blog({ title, description: sanitizedDescription, image, tags });
    await blog.save();

    return sendResponse(res, 201, blog, false, "Blog created successfully");

  } catch (error) {

    console.error("Error creating blog:", error.message);

    if (error.name === 'ValidationError') {
      // Mongoose validation errors
      const messages = Object.values(error.errors).map(val => val.message);
      return sendResponse(res, 400, null, true, messages.join(', '));
    } 

    // Generic server error
    return sendResponse(res, 500, null, true, `server error: ${error.message}`);
  }
};