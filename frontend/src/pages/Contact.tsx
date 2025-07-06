
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
          
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Have a question or need assistance? We're here to help.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="Your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Your last name" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="your.email@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="How can we help you?" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                />
              </div>
              
              <Button className="w-full btn-primary">
                Send Message
              </Button>
            </form>

            <div className="mt-12 pt-8 border-t text-center">
              <h3 className="font-semibold mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-2 text-gray-600">
                <p>Email: hello@pktrends.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Business Hours: Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
