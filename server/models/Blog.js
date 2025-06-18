import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
}, { timestamps: true });

const Blog = mongoose.model('blog', blogSchema);

export default Blog;
// This model defines the structure of a blog post in the database.
// It includes fields for title, subtitle, description, category, image, and publication status.