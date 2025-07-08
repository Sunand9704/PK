import {
  AlertTriangle,
  Info,
  Shield,
  FileText,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This disclaimer governs your use of PK Trends. By using our website,
            you accept this disclaimer in full.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: December 2024
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* General Disclaimer */}
          <section>
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                1. General Disclaimer
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                The information provided on PK Trends ("the Website") is for
                general informational purposes only. While we strive to keep the
                information up to date and correct, we make no representations
                or warranties of any kind, express or implied, about the
                completeness, accuracy, reliability, suitability, or
                availability of the information, products, services, or related
                graphics contained on the Website for any purpose.
              </p>
              <p>
                Any reliance you place on such information is therefore strictly
                at your own risk. In no event will we be liable for any loss or
                damage including without limitation, indirect or consequential
                loss or damage, arising from loss of data or profits arising out
                of, or in connection with, the use of this Website.
              </p>
            </div>
          </section>

          {/* Product Information */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                2. Product Information Disclaimer
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Product descriptions, images, specifications, and pricing
                information on our Website are provided for informational
                purposes only. While we make every effort to ensure the accuracy
                of this information, we do not guarantee that product
                descriptions, images, or other content is accurate, complete,
                reliable, current, or error-free.
              </p>
              <p>
                Product images are for illustrative purposes only and may not
                reflect the exact appearance of the actual product. Colors,
                sizes, and other product details may vary from what is displayed
                on the Website.
              </p>
              <p>
                Product availability is subject to change without notice. We
                reserve the right to discontinue any product at any time.
              </p>
            </div>
          </section>

          {/* External Links */}
          <section>
            <div className="flex items-center mb-4">
              <ExternalLink className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                3. External Links Disclaimer
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Our Website may contain links to external websites that are not
                provided or maintained by us. These links are provided for your
                convenience and information only.
              </p>
              <p>
                We do not endorse, approve, or control these external websites
                and are not responsible for their content, privacy policies, or
                practices. We do not guarantee the accuracy, relevance,
                timeliness, or completeness of any information on these external
                websites.
              </p>
              <p>
                You acknowledge and agree that we shall not be responsible or
                liable, directly or indirectly, for any damage or loss caused or
                alleged to be caused by or in connection with the use of or
                reliance on any such content, goods, or services available on or
                through any such external websites.
              </p>
            </div>
          </section>

          {/* Financial Information */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                4. Financial Information Disclaimer
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Any financial information provided on our Website is for general
                informational purposes only and should not be considered as
                financial advice. We are not financial advisors, and the
                information provided should not be used as a substitute for
                professional financial advice.
              </p>
              <p>
                Prices, discounts, and promotional offers are subject to change
                without notice. We reserve the right to modify or discontinue
                any pricing or promotional offers at any time.
              </p>
              <p>
                Currency conversion rates, if displayed, are approximate and may
                not reflect current market rates. Actual charges may vary based
                on your payment method and location.
              </p>
            </div>
          </section>

          {/* Health and Safety */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                5. Health and Safety Disclaimer
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                While we strive to provide safe and high-quality products, we
                cannot guarantee that our products are suitable for all
                individuals. Customers should exercise their own judgment and
                discretion when using our products.
              </p>
              <p>
                If you have any allergies, sensitivities, or medical conditions,
                please consult with a healthcare professional before using our
                products. We are not responsible for any adverse reactions or
                health issues that may arise from the use of our products.
              </p>
              <p>
                Product care instructions should be followed carefully. We are
                not liable for any damage to products resulting from improper
                care or use.
              </p>
            </div>
          </section>

          {/* Technical Information */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                6. Technical Information Disclaimer
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We do not warrant that the Website will be uninterrupted,
                timely, secure, or error-free. We do not warrant that the
                results that may be obtained from the use of the Website will be
                accurate or reliable.
              </p>
              <p>
                We do not warrant that the quality of any products, services,
                information, or other material purchased or obtained through the
                Website will meet your expectations.
              </p>
              <p>
                The Website may contain technical inaccuracies or typographical
                errors. We reserve the right to make changes, corrections, and
                improvements to the Website at any time without notice.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                7. Limitation of Liability
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                To the fullest extent permitted by applicable law, PK Trends,
                its officers, directors, employees, agents, and affiliates shall
                not be liable for any direct, indirect, incidental, special,
                consequential, or punitive damages, including but not limited
                to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Loss of profits, revenue, or data</li>
                <li>Business interruption</li>
                <li>Personal injury or property damage</li>
                <li>
                  Any damages resulting from the use or inability to use our
                  Website or services
                </li>
                <li>
                  Any damages resulting from unauthorized access to or
                  alteration of your transmissions or data
                </li>
              </ul>
              <p>
                This limitation of liability applies whether the alleged
                liability is based on contract, tort, negligence, strict
                liability, or any other basis, even if we have been advised of
                the possibility of such damage.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                8. Indemnification
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                You agree to indemnify, defend, and hold harmless PK Trends, its
                officers, directors, employees, agents, and affiliates from and
                against any and all claims, damages, obligations, losses,
                liabilities, costs, or debt, and expenses (including but not
                limited to attorney's fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of and access to the Website</li>
                <li>Your violation of any term of these disclaimers</li>
                <li>
                  Your violation of any third-party right, including without
                  limitation any copyright, property, or privacy right
                </li>
                <li>
                  Any claim that your use of the Website caused damage to a
                  third party
                </li>
              </ul>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                9. Governing Law
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                This disclaimer shall be governed by and construed in accordance
                with the laws of the United States, without regard to its
                conflict of law provisions.
              </p>
              <p>
                Any disputes arising from this disclaimer or your use of the
                Website shall be subject to the exclusive jurisdiction of the
                courts in the United States.
              </p>
            </div>
          </section>

          {/* Changes to Disclaimer */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                10. Changes to Disclaimer
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We reserve the right to modify this disclaimer at any time.
                Changes will be effective immediately upon posting on the
                Website. Your continued use of the Website after any changes
                constitutes acceptance of the modified disclaimer.
              </p>
              <p>
                It is your responsibility to review this disclaimer periodically
                for any changes. If you do not agree to the modified disclaimer,
                you should discontinue using the Website.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this disclaimer, please contact
              us:
            </p>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  <strong>Email:</strong> legal@pktrends.com
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  <strong>Phone:</strong> +1 (234) 567-8900
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  <strong>Address:</strong> 123 Fashion Street, New York, NY
                  10001, United States
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
