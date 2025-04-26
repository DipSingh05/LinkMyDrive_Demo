import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS } from '@/lib/constants';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        className="text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Choose the plan that fits your needs. All plans include access to all features.
        </p>
      </motion.div>

      <div className="mb-10">
        <Tabs defaultValue="monthly" className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly" onClick={() => setBillingPeriod('monthly')}>Monthly</TabsTrigger>
            <TabsTrigger value="yearly" onClick={() => setBillingPeriod('yearly')}>Yearly</TabsTrigger>
            {/* <TabsTrigger value="payg" onClick={() => setBillingPeriod('payg')}>Pay As You Go</TabsTrigger> */}
          </TabsList>
        </Tabs>
      </div>

      {/* Free Tier */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 text-center max-w-xl mx-auto">
          <div className="inline-block text-4xl text-primary mb-4">
            <i className="ri-gift-line"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
          <p className="text-3xl font-bold mb-4">₹0<span className="text-gray-500 text-base font-normal">/forever</span></p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Basic storage needs for personal use</p>
          <ul className="text-left mb-6 space-y-2">
            {PRICING_PLANS[0].features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="lg" className="w-full">Sign Up Free</Button>
        </div>
      </motion.div>

      {/* Paid Plans */}
      <motion.div
        className="grid md:grid-cols-3 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {PRICING_PLANS.slice(1).map((plan, index) => {
          const price = billingPeriod === 'yearly' && plan.yearly 
            ? plan.yearly 
            : billingPeriod === 'payg' && plan.payg
              ? plan.payg
              : plan.price;

          const periodSuffix = billingPeriod === 'yearly' 
            ? '/year' 
            : billingPeriod === 'payg'
              ? ''
              : '/month';

          return (
            <motion.div 
              key={index}
              variants={itemVariants}
              className={`bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden ${plan.highlighted ? 'ring-2 ring-primary relative' : ''}`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                <p className="text-3xl font-bold mb-4">
                  {typeof price === 'number' ? `₹${price}` : price}
                  <span className="text-gray-500 text-base font-normal">{periodSuffix}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.highlighted ? 'bg-primary hover:bg-blue-600' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enterprise Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4">Enterprise Plan</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Need a custom solution for your organization? Our enterprise plan offers dedicated support, custom integrations, and flexible pricing.
        </p>
        <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
          Contact Sales
        </Button>
      </motion.div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: "Can I change plans later?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
            },
            {
              question: "How do you calculate storage usage?",
              answer: "We measure your storage based on the original file size across all connected drives. Compressed files are counted by their compressed size."
            },
            {
              question: "Is there a file size limit?",
              answer: "Free plans can upload files up to 100MB in size. Paid plans support files up to 10GB, and Enterprise plans have custom limits."
            },
            {
              question: "What happens if I exceed my storage limit?",
              answer: "You'll receive a notification when you reach 90% of your limit. If you exceed it, you can still access your files but won't be able to upload new ones until you upgrade or free up space."
            }
          ].map((faq, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-dark-surface rounded-lg shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
            >
              <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
