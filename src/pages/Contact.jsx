import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa';

const contactInfo = [
  { icon: <FaEnvelope className="text-blue-600" />, label: 'Email',    value: 'amjadshahg26@gmail.com',  href: 'mailto:amjadshahg26@gmail.com' },
  { icon: <FaPhone    className="text-blue-600" />, label: 'Phone',    value: '+92 329-501-5604',          href: null },
  { icon: <FaMapMarkerAlt className="text-blue-600" />, label: 'Location', value: 'I9 Markaz, Islamabad', href: null },
  { icon: <FaGithub   className="text-blue-600" />, label: 'GitHub',   value: 'github.com/amjadazizshah', href: 'https://github.com/amjadazizshah' },
  { icon: <FaLinkedin className="text-blue-600" />, label: 'LinkedIn', value: 'Connect with me',          href: 'https://www.linkedin.com/in/muhammad-amjad-aziz-shah-07a230383' },
];

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.target);
    formData.append('access_key', 'YOUR_ACCESS_KEY_HERE');
    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
      if (data.success) e.target.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 py-16 px-6 text-center">
        <span className="section-label block mb-2">Let's Talk</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Contact Me</h1>
        <p className="text-slate-500 max-w-md mx-auto">Open to freelance projects, collaborations, or just a friendly chat about tech.</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Info column */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">Get in touch</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Fill out the form and your message will land directly in my inbox. I usually respond within 24 hours.
          </p>
          <div className="space-y-4 pt-2">
            {contactInfo.map(c => (
              <div key={c.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{c.label}</p>
                  {c.href
                    ? <a href={c.href} target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">{c.value}</a>
                    : <p className="text-sm font-semibold text-slate-700">{c.value}</p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3 card p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                <input type="text" name="name" required placeholder="Your Name"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input type="email" name="email" required placeholder="your@email.com"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
              <input type="text" name="subject" placeholder="What is this about?"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
              <textarea name="message" required rows="5" placeholder="Tell me about your project or idea..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 bg-white resize-none" />
            </div>
            <button type="submit" disabled={status === 'sending'}
              className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'sending' ? 'Sending...' : 'Send Message →'}
            </button>
            {status === 'success' && <p className="text-center text-green-600 font-semibold text-sm">✅ Message sent! I'll get back to you soon.</p>}
            {status === 'error'   && <p className="text-center text-red-500 font-semibold text-sm">❌ Failed to send. Please configure Web3Forms key or email me directly.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
