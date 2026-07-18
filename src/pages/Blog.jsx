import { useEffect, useState } from 'react';
import { fetchBlogs } from '../api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadBlogs = async () => {
          try {
              const data = await fetchBlogs();
              setBlogs(data);
          } catch (e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      };
      loadBlogs();
  }, []);

  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 inline-block">Technical Blog</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mt-2 opacity-70"></div>
        </div>
        
        {loading ? (
            <div className="text-center text-slate-400 py-12">Loading blogs...</div>
        ) : (
            <div className="flex flex-col gap-8">
              {blogs.map((post, index) => (
                <div key={post.id || index} className="glass-card p-8 rounded-2xl group hover:-translate-y-1 transition-transform duration-300">
                  <p className="text-blue-400 font-medium mb-3 text-sm tracking-wide uppercase">{post.date}</p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{post.title}</h2>
                  <p className="text-slate-300 leading-relaxed mb-6 text-lg">{post.excerpt}</p>
                  <a href="#" className="inline-flex items-center text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                    Read more <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </a>
                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
