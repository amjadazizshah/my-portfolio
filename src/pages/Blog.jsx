import { useEffect, useState } from 'react';
import { fetchBlogs } from '../api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs().then(setBlogs).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 py-16 px-6 text-center">
        <span className="section-label block mb-2">Writing</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Technical Blog</h1>
        <p className="text-slate-500 max-w-md mx-auto">Thoughts on software engineering, tools I use, and lessons learned.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {blogs.map((post, i) => (
              <div key={post.id || i} className="card card-hover p-8 group cursor-pointer">
                <span className="section-label mb-2 block">{post.date}</span>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-5">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Read more →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
