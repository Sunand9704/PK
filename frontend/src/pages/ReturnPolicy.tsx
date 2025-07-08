import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Return Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Read our
            return and refund policy below.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: December 2024
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Return Eligibility */}
          <section>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                1. Return Eligibility
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Most new, unopened items can be returned within 2 days of
                delivery for a full refund . Items must be in their
                original condition, unworn, unwashed, and with all original tags
                and packaging.
              </p>
              <p>
                Certain items, such as final sale, personalized, or intimate
                products, may not be eligible for return. Please check the
                product description for specific return eligibility.
              </p>
            </div>
          </section>

          {/* Return Process */}
          <section>
            <div className="flex items-center mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                2. How to Initiate a Return
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                To initiate a return, please contact our support team at{" "}
                <a
                  href="mailto:support@pktrends.com"
                  className="text-blue-600 underline"
                >
                  support@pktrends.com
                </a>{" "}
                with your order number and reason for return.
              </p>
              <p>
                Our team will provide you with a return authorization and
                instructions for sending your item(s) back.
              </p>
            </div>
          </section>

          {/* Return Shipping */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                3. Return Shipping
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Return shipping costs are the responsibility of the customer
                unless the item was received damaged, defective, or incorrect.
              </p>
              <p>
                We recommend using a trackable shipping service or purchasing
                shipping insurance. We are not responsible for items lost or
                damaged in transit.
              </p>
            </div>
          </section>

          {/* Refunds */}
          <section>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                4. Refunds
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Once your return is received and inspected, we will notify you
                of the approval or rejection of your refund. Approved refunds
                will be processed within 5-7 business days and credited to your
                original payment method.
              </p>
              <p>
                Shipping charges are non-refundable, except in cases where the
                return is due to our error (damaged, defective, or incorrect
                item).
              </p>
            </div>
          </section>

          {/* Exchanges */}
          <section>
            <div className="flex items-center mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                5. Exchanges
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                If you need to exchange an item for a different size, color, or
                style, please contact us to arrange the exchange. Exchanges are
                subject to product availability.
              </p>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                6. Damaged or Defective Items
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                If you receive a damaged, defective, or incorrect item, please
                contact us within 5 business days of delivery. We will arrange
                for a replacement or issue a full refund, including return
                shipping costs.
              </p>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                7. Non-Returnable Items
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Final sale items</li>
                <li>Gift cards</li>
                <li>Personalized or custom-made products</li>
                <li>Intimate or sanitary goods</li>
                <li>
                  Items marked as non-returnable in the product description
                </li>
              </ul>
            </div>
          </section>

          {/* Changes to Return Policy */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                8. Changes to Return Policy
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We reserve the right to update or modify this Return Policy at
                any time. Changes will be effective immediately upon posting on
                the Website. Please review this page periodically for any
                updates.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our Return Policy, please contact
              us:
            </p>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  <strong>Email:</strong> support@pktrends.com
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

export default ReturnPolicy;
