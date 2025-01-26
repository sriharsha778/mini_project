import React, { useState } from 'react';

function Forum() {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]); // Get the selected file
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postContent && !fileInput) {
      alert("Please add text or a file (photo/video) before submitting!");
      return;
    }

    const formData = new FormData();
    formData.append('text', postContent);
    if (fileInput) formData.append('file', fileInput);

    // Simulate post submission here (you can send this to your server)
    setPosts([{ text: postContent, file: fileInput ? URL.createObjectURL(fileInput) : null }, ...posts]);

    setPostContent('');
    setFileInput(null);
  };

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            
            {/* Main Content Area */}
            <main className="flex-1 p-8">

              {/* Post Creation Form */}
              <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
                <form onSubmit={handlePostSubmit}>
                  <div className="mb-4">
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows="5"
                      placeholder="What's on your mind?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Upload Image/Icon */}
                    <label htmlFor="file_upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-800">Add Image/Video</span>
                    </label>
                    <input
                      type="file"
                      id="file_upload"
                      accept="image/*, video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {fileInput && <span className="text-gray-500">{fileInput.name}</span>}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Post
                  </button>
                </form>
              </section>

              {/* List of Posts */}
              <section className="space-y-8">
                {posts.map((post, index) => (
                  <article key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">User {index + 1}</h3>
                      <span className="text-gray-500 text-sm">Posted on: {new Date().toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{post.text}</p>
                    {post.file && (
                      <div className="w-full">
                        <img src={post.file} alt="Post content" className="w-full rounded-md" />
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500 text-sm mt-4">
                      <button className="hover:text-blue-600">Like</button>
                      <button className="hover:text-blue-600">Comment</button>
                      <button className="hover:text-blue-600">Share</button>
                    </div>
                  </article>
                ))}
              </section>
            </main>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
