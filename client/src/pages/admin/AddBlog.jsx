import React, { useState, useRef, useEffect } from 'react';
import { assets, blogCategories } from '../../assets/assets';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('Startup');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      formData.append('image', image);

      const { data } = await axios.post('/api/blog/add', formData);

      if (data.success) {
        toast.success(data.message);
        setImage(false);
        setTitle('');
        setSubTitle('');
        quillRef.current.root.innerHTML = '';
        setCategory('Startup');
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const generateContent = async () => {
    if (!title) {
      toast.error("Please provide a blog title first.");
      return;
    }

    setIsGenerating(true);

    // --- Start of New Prompt Logic ---

    // 1. Create a base prompt with general instructions.
    let basePrompt = `Write a comprehensive blog post about "${title}". The response should be formatted in clean HTML, suitable for a rich text editor like Quill. Use headings (h2, h3), paragraphs (p), and lists (ul, li) to structure the content. Do not include <html> or <body> tags.`;

    // 2. Add specific instructions based on the category.
    let categorySpecifics = '';
    switch (category) {
      case 'Technology':
        categorySpecifics = 'Since this is a technology topic, make the article detailed and in-depth, around 800-1000 words. Explain technical concepts clearly and provide practical examples or code snippets if applicable.';
        break;
      case 'Startup':
        categorySpecifics = 'For this startup topic, focus on business strategy, market analysis, and actionable advice for entrepreneurs. Keep the tone inspiring and informative.';
        break;
      case 'Lifestyle':
        categorySpecifics = 'This is a lifestyle blog, so adopt a personal, engaging, and relatable tone. Use storytelling and share personal anecdotes if it makes sense for the topic.';
        break;
      default:
        categorySpecifics = 'Make the article engaging and informative for a general audience.';
    }
    
    // 3. Combine the base prompt and the specific instructions.
    const finalPrompt = `${basePrompt} ${categorySpecifics}`;

    // --- End of New Prompt Logic ---

    try {
      const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: finalPrompt }], // Use the final, detailed prompt
            },
          ],
        }
      );
      
      const generatedText = data.candidates[0].content.parts[0].text;

      if (generatedText) {
        // Since we asked for HTML, we can directly set the innerHTML.
        quillRef.current.root.innerHTML = generatedText;
        toast.success("Content generated!");
      }

    } catch (error) {
      console.error("API Call Failed:", error);
      toast.error("Generation failed. Check the console for errors.");
    } finally {
      setIsGenerating(false);
    }
  };


  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  return (
    // ... your JSX remains the same
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-y-auto'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        {/* Upload thumbnail */}
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className='mt-2 h-16 rounded cursor-pointer'
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        {/* Blog title */}
        <p className='mt-4'>Blog title</p>
        <input
          type="text"
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        {/* Sub title */}
        <p className='mt-4'>Sub title</p>
        <input
          type="text"
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        {/* Blog Description + AI Generate Button */}
        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef} style={{minHeight: '200px'}}></div>
          <button
            type='button'
            onClick={generateContent}
            disabled={isGenerating} // Disable button while generating
            className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <p className='mt-4'>Blog category</p>
        <select
          onChange={e => setCategory(e.target.value)}
          value={category}
          name="category"
          className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'
        >
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        <div className='flex gap-2 mt-4 items-center'>
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            className='scale-125 cursor-pointer'
            onChange={e => setIsPublished(e.target.checked)}
          />
        </div>

        <button disabled={isAdding} type="submit" className='mt-8 w-40 h-10 bg-blue-600 text-white rounded cursor-pointer text-sm disabled:bg-blue-400'>
          {isAdding ? 'Adding...' : 'Add Blog'}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;