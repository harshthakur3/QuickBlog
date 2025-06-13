import React from 'react';
import { assets } from '../../assets/assets';

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id, isApproved, name, content } = comment;
  const BlogDate = new Date(createdAt);

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
              src={assets.tick_icon}
              alt='Approve'
              title='Approve'
              className='w-5 hover:scale-110 transition-all cursor-pointer'
              onClick={() => {/* logic to approve */}}
            />
          )}

          {/* Delete */}
          <img
            src={assets.bin_icon}
            alt='Delete'
            title='Delete'
            className='w-5 hover:scale-110 transition-all cursor-pointer'
            onClick={() => {/* logic to delete */}}
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
