import { Truck, Clock, MapPin, Info, Mail, Phone } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn about our shipping methods, delivery times, and related
            policies for a smooth shopping experience.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: July 2025
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Shipping Methods */}
          <section>
            <div className="flex items-center mb-4">
              <Truck className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                1. Shipping Methods
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We offer a variety of shipping options to meet your needs,
                including standard, expedited, and express delivery. Shipping
                methods and carriers are selected based on your location and the
                items in your order.
              </p>
              <p>
                Shipping is available to all 50 U.S. states and most
                international destinations. Some restrictions may apply to
                certain locations or products.
              </p>
            </div>
          </section>

          {/* Processing Time */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                2. Order Processing Time
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Orders are processed within 1-2 business days after payment is
                received. Orders placed on weekends or holidays will be
                processed on the next business day.
              </p>
              <p>
                You will receive a confirmation email with tracking information
                once your order has shipped.
              </p>
            </div>
          </section>

          {/* Delivery Estimates */}
          <section>
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                3. Delivery Estimates
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>Estimated delivery times are as follows:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard Shipping: 3-7 business days</li>
                <li>Expedited Shipping: 2-3 business days</li>
                <li>Express Shipping: 1-2 business days</li>
                <li>
                  International Shipping: 7-21 business days (varies by
                  destination)
                </li>
              </ul>
              <p>
                Please note that delivery times are estimates and may vary due
                to factors beyond our control, such as weather, customs, or
                carrier delays.
              </p>
            </div>
          </section>

          {/* Shipping Charges */}
          <section>
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                4. Shipping Charges
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Shipping charges are calculated at checkout based on the weight,
                dimensions, and destination of your order. Free shipping may be
                available for orders over a certain amount, as indicated on the
                Website.
              </p>
              <p>
                International orders may be subject to additional customs
                duties, taxes, or fees, which are the responsibility of the
                recipient.
              </p>
            </div>
          </section>

          {/* Tracking Orders */}
          <section>
            <div className="flex items-center mb-4">
              <Truck className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                5. Tracking Your Order
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Once your order has shipped, you will receive a tracking number
                via email. You can use this number to track the status of your
                shipment on the carrier's website.
              </p>
              <p>
                If you have not received your tracking information within 3
                business days of placing your order, please contact our support
                team.
              </p>
            </div>
          </section>

          {/* Undeliverable Packages */}
          <section>
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                6. Undeliverable Packages
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                If a package is returned to us as undeliverable due to an
                incorrect address, refusal, or failure to claim, we will contact
                you to arrange reshipment. Additional shipping charges may
                apply.
              </p>
              <p>
                If you do not respond within 7 days, your order may be canceled
                and a refund issued, minus shipping fees.
              </p>
            </div>
          </section>

          {/* Damaged or Lost Packages */}
          <section>
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                7. Damaged or Lost Packages
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                If your package arrives damaged or is lost in transit, please
                contact us within 5 business days of the expected delivery date.
                We will work with the carrier to resolve the issue and, if
                necessary, send a replacement or issue a refund.
              </p>
              <p>
                Please retain all packaging materials and take photos of any
                damage to assist with the claims process.
              </p>
            </div>
          </section>

          {/* Changes to Shipping Policy */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                8. Changes to Shipping Policy
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We reserve the right to update or modify this Shipping Policy at
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
              If you have any questions about our Shipping Policy, please
              contact us:
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

export default ShippingPolicy;
