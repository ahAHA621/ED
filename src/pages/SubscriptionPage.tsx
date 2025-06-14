import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Star, Users, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price');

      if (error) throw error;
      setPlans(data);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load subscription plans');
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setError('Please log in to subscribe');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (!plan) throw new Error('Plan not found');

      // In a real app, you would integrate with a payment provider here
      // For demo purposes, we'll create a subscription directly
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });

      if (subscriptionError) throw subscriptionError;

      // Redirect to dashboard or show success message
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error subscribing:', err);
      setError('Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Choose Your Learning Adventure
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Unlock a world of educational content with our flexible subscription plans
          </motion.p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                selectedPlan === plan.id ? 'ring-2 ring-primary-500' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ translateY: -5 }}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Subscribe?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-primary-500 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">Premium Content</h3>
                  <p className="text-gray-600">Access our full library of educational activities and games</p>
                </div>
              </div>
              <div className="flex items-start">
                <Star className="h-6 w-6 text-primary-500 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">Expert Support</h3>
                  <p className="text-gray-600">Get help from our education specialists when you need it</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-6 w-6 text-primary-500 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">Family Access</h3>
                  <p className="text-gray-600">Create multiple profiles for all your children</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;