import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: data.message,
          variant: "default",
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: "Failed to send message",
          description:
            data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <Skeleton className="h-6 w-32 mx-auto" />
                ) : (
                  "Send Message"
                )}
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
