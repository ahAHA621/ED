import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import subscriptionPlans from '../data/subscriptionData';
import Button from '../components/ui/Button';

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true);
      setError('');

      if (!user) {
        navigate('/login');
        return;
      }

      // Store subscription in Supabase
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_id: user.id,
            plan: planId,
            status: 'active',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          }
        ]);

      if (subscriptionError) throw subscriptionError;

      // Navigate to success page
      navigate('/subscription/success', { 
        state: { planId } 
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">
            Select the perfect subscription plan for your child's learning journey
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-lg shadow-sm p-6 border-2 ${
                plan.mostPopular ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              {plan.mostPopular && (
                <div className="bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`flex items-start ${
                      feature.included ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    <svg
                      className={`h-6 w-6 mr-2 ${
                        feature.included ? 'text-green-500' : 'text-gray-300'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          feature.included
                            ? 'M5 13l4 4L19 7'
                            : 'M6 18L18 6M6 6l12 12'
                        }
                      />
                    </svg>
                    {feature.name}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.mostPopular ? 'primary' : 'outline'}
                fullWidth
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Subscribe to ${plan.name}`}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;