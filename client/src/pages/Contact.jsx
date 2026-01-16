import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          console.log(result.text);
          setStatus('Message sent successfully!');
          e.target.reset();
          // Clear success message after 3 seconds
          setTimeout(() => setStatus(''), 3000);
        },
        (error) => {
          console.log(error.text);
          setStatus('Failed to send message. Please try again.');
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT SIDE: Contact Info & Decor */}
        <div className="w-full md:w-1/2 bg-green-600 p-8 md:p-12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-green-100 mb-8 text-lg">
              Have questions about your medical reports? Need help using the AI features? 
              Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {/* Email Icon */}
                <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>support@healthmate.com</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Location Icon */}
                <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Karachi, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="mt-10 relative">
             <div className="w-24 h-24 bg-green-500 rounded-full opacity-50 absolute -bottom-10 -left-10"></div>
             <div className="w-40 h-40 bg-green-500 rounded-full opacity-30 absolute -bottom-20 -right-10"></div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send us a Message</h3>
          
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Your Name</label>
              <input 
                type="text" 
                name="user_name" 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                placeholder="John Doe"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Your Email</label>
              <input 
                type="email" 
                name="user_email" 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                placeholder="john@example.com"
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
              <textarea 
                name="message" 
                required
                rows="4" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200 resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              {status === 'Sending...' ? 'Sending...' : 'Send Message'}
            </button>

            {/* Status Message */}
            {status && (
              <div className={`text-center mt-4 p-2 rounded ${status.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;