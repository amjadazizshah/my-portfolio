import { useState } from 'react';

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    const formData = new FormData(e.target);
    
    // Web3Forms integration - user needs to replace "YOUR_ACCESS_KEY_HERE" with actual key
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setStatus('Message sent successfully!');
        e.target.reset();
      } else {
        setStatus('Error sending message. Please configure Web3Forms key.');
      }
    } catch (err) {
      setStatus('Network error occurred.');
    }
  };

  return (
    <div className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 inline-block">Contact Me</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mt-2 opacity-70"></div>
        </div>
        
        <div className="glass-card p-8 md:p-12 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-slate-300 font-medium mb-2">Name</label>
                <input type="text" id="name" name="name" required className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-slate-300 font-medium mb-2">Email</label>
                <input type="email" id="email" name="email" required className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="your.email@example.com" />
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-slate-300 font-medium mb-2">Message</label>
              <textarea id="message" name="message" required rows="6" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none" placeholder="How can I help you?"></textarea>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1">
              {status || 'Send Message'}
            </button>
            {status && <p className="text-center mt-4 text-emerald-400">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
