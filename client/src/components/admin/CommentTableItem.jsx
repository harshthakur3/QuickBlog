import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id, isApproved, name, content } = comment;
  const BlogDate = new Date(createdAt);

  const {axios} = useAppContext();

  const approveComment = async () =>{
    try {
      const { data } = await axios.post('/api/admin/approve-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const deleteComment = async () => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this comment?');
      if (!confirm) return;

      const { data } = await axios.post('/api/admin/delete-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <tr className='border-y border-gray-200'>
      {/* Blog Details */}
      <td className='px-6 py-4'>
        <p><b className='text-gray-600'>Blog:</b> {blog.title}</p>
        <p><b className='text-gray-600'>Name:</b> {name}</p>
        <p><b className='text-gray-600'>Comment:</b> {content}</p>
      </td>

      {/* Date */}
      <td className='px-6 py-4 max-sm:hidden'>
        {BlogDate.toLocaleDateString()}
      </td>

      {/* Status + Actions */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-4'>
          {/* Status */}
          {isApproved ? (
            <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>
              Approved
            </p>
          ) : (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              alt='Approve'
              title='Approve'
              className='w-5 hover:scale-110 transition-all cursor-pointer'
            />
          )}

          {/* Delete */}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt='Delete'
            title='Delete'
            className='w-5 hover:scale-110 transition-all cursor-pointer'
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
