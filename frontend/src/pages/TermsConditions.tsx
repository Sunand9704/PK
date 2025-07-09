import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  CreditCard,
  Truck,
  RefreshCw,
} from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our
            services. By accessing or using PK Trends, you agree to be bound by
            these terms.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: July 2025
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                1. Acceptance of Terms
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                By accessing and using PK Trends ("the Website"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
              <p>
                These terms apply to all visitors, users, and others who access
                or use the Website. By using the Website, you represent that you
                are at least 18 years old and have the legal capacity to enter
                into these terms.
              </p>
            </div>
          </section>

          {/* Use License */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                2. Use License
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on PK Trends for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>
                  Use the materials for any commercial purpose or for any public
                  display
                </li>
                <li>
                  Attempt to reverse engineer any software contained on PK
                  Trends
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                3. User Accounts
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. Failure to
                do so constitutes a breach of the Terms, which may result in
                immediate termination of your account.
              </p>
              <p>
                You are responsible for safeguarding the password that you use
                to access the Website and for any activities or actions under
                your password. You agree not to disclose your password to any
                third party.
              </p>
              <p>
                You agree that you will not use the Website for any unlawful
                purpose or to solicit others to perform or participate in any
                unlawful acts.
              </p>
            </div>
          </section>

          {/* Product Information */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                4. Product Information
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We strive to display as accurately as possible the colors,
                features, specifications, and details of the products available
                on the Website. However, we do not guarantee that the colors,
                features, specifications, and details of the products will be
                accurate, complete, reliable, current, or free of other errors.
              </p>
              <p>
                All product images are for illustrative purposes only. Actual
                products may vary from the images shown. Product availability is
                subject to change without notice.
              </p>
            </div>
          </section>

          {/* Pricing and Payment */}
          <section>
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                5. Pricing and Payment
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                All prices are shown in IND and are subject to change without
                notice. Prices do not include applicable taxes, shipping, or
                handling charges.
              </p>
              <p>
                Payment must be made at the time of order placement. We accept
                major credit cards, debit cards, and other payment methods as
                indicated on the Website.
              </p>
              <p>
                By providing payment information, you represent and warrant that
                you have the legal right to use the payment method and that the
                information is accurate and complete.
              </p>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section>
            <div className="flex items-center mb-4">
              <Truck className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                6. Shipping and Delivery
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We will make every effort to ship your order within the
                timeframe specified on the Website. However, delivery times are
                estimates only and may vary due to circumstances beyond our
                control.
              </p>
              <p>
                Risk of loss and title for items purchased pass to you upon
                delivery of the items to the carrier. You are responsible for
                filing any claims with carriers for damaged and/or lost
                shipments.
              </p>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section>
            <div className="flex items-center mb-4">
              <RefreshCw className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                7. Returns and Refunds
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We want you to be completely satisfied with your purchase. If
                you are not satisfied, you may return most items within 30 days
                of delivery for a refund or exchange.
              </p>
              <p>
                Items must be returned in their original condition, unworn,
                unwashed, and with all original tags attached. Return shipping
                costs are the responsibility of the customer unless the item was
                received damaged or defective.
              </p>
              <p>
                Refunds will be processed within 5-7 business days after we
                receive your return. The refund will be credited to the original
                payment method used for the purchase.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                8. Intellectual Property
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                The Website and its original content, features, and
                functionality are and will remain the exclusive property of PK
                Trends and its licensors. The Website is protected by copyright,
                trademark, and other laws.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection
                with any product or service without our prior written consent.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                9. Limitation of Liability
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                In no event shall PK Trends, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                use of the Website.
              </p>
              <p>
                Our total liability to you for any claims arising from the use
                of the Website shall not exceed the amount you paid to us in the
                12 months preceding the claim.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                10. Governing Law
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                These Terms shall be interpreted and governed by the laws of the
                United States, without regard to its conflict of law provisions.
                Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights.
              </p>
              <p>
                If any provision of these Terms is held to be invalid or
                unenforceable by a court, the remaining provisions of these
                Terms will remain in effect.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                11. Changes to Terms
              </h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
              <p>
                What constitutes a material change will be determined at our
                sole discretion. By continuing to access or use our Website
                after any revisions become effective, you agree to be bound by
                the revised terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms & Conditions, please
              contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> pktrends359@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> +91 9100998850
              </p>
              <p>
                <strong>Address:</strong> 123 Fashion Street, New York, NY
                10001, United States
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
