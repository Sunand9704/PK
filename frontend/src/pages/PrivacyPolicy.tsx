import React from "react";
import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-gray-600 mt-1">Last updated: July 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-purple-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At PK Trends, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website, make purchases, or
                interact with our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our website and services, you consent to the data
                practices described in this policy. If you do not agree with our
                policies and practices, please do not use our website.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-purple-600" />
                Information We Collect
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Personal Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>
                      Name and contact information (email, phone number,
                      address)
                    </li>
                    <li>
                      Payment information (credit card details, billing address)
                    </li>
                    <li>Account credentials and preferences</li>
                    <li>Order history and purchase behavior</li>
                    <li>Communication preferences and marketing opt-ins</li>
                  </ul>
                </div>

                {/* <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Automatically Collected Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Operating system and platform</li>
                    <li>Website usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div> */}
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-600" />
                How We Use Your Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Order Processing
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Process and fulfill your orders, send order confirmations,
                    and provide customer support.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Account Management
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Create and manage your account, save preferences, and
                    provide personalized experiences.
                  </p>
                </div>

                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Marketing & Communications
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Send promotional emails, newsletters, and updates about new
                    products and offers.
                  </p>
                </div> */}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Website Improvement
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Analyze website usage, improve functionality, and enhance
                    user experience.
                  </p>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-purple-600" />
                Information Sharing & Disclosure
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except in the
                following circumstances:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Service Providers:</strong> We may share information
                  with trusted third-party service providers who assist us in
                  operating our website, processing payments, and delivering
                  orders.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information when required by law, court order, or government
                  request.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  acquisition, or sale of assets, your information may be
                  transferred as part of the business transaction.
                </li>
                <li>
                  <strong>Safety & Security:</strong> We may share information
                  to protect our rights, property, or safety, or that of our
                  customers and the public.
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Security
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security
                measures to protect your personal information against:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm">
                    Unauthorized access, alteration, or disclosure
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm">
                    Data loss, destruction, or corruption
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm">
                    SSL encryption for data transmission
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm">
                    Secure payment processing
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Rights
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                You have the following rights regarding your personal
                information:
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Access:</strong> Request access to your personal
                    information
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Correction:</strong> Request correction of
                    inaccurate information
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Deletion:</strong> Request deletion of your personal
                    information
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Opt-out:</strong> Unsubscribe from marketing
                    communications
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2 text-purple-600" />
                Contact Us
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@pktrends.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> +1 (234) 567-8900
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> 123 Fashion Street, New York, NY
                    10001
                  </p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Updates to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. We encourage you
                to review this Privacy Policy periodically to stay informed
                about how we protect your information.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
