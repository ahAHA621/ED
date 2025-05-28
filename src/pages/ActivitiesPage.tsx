import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Lock } from 'lucide-react';
import Card from '../components/ui/Card';
import activityData from '../data/activitiesData';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const ActivityPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredActivities = activityData.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user has an active subscription
  const hasSubscription = user?.subscription && user.subscription !== 'free';

  return (
    <div className="py-12 md:py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.h1 
            className="font-nunito font-bold text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            TinyTap Activities
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore fun, interactive TinyTap activities to boost your learning experience!
          </motion.p>
          
          {!hasSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 bg-primary-50 p-6 rounded-xl border border-primary-100"
            >
              <h3 className="text-xl font-bold text-primary-800 mb-2">
                Unlock All Activities
              </h3>
              <p className="text-primary-600 mb-4">
                Subscribe to access our complete collection of educational activities!
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/subscription')}
              >
                View Subscription Plans
              </Button>
            </motion.div>
          )}
        </div>

        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search activities..." 
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {hasSubscription ? (
                  <Link to={`/activities/${activity.id}`}>
                    <Card hover>
                      <Card.Image 
                        src={activity.imageUrl} 
                        alt={activity.title}
                        className="h-48"
                      />
                      <Card.Content>
                        <div className="flex gap-2 mb-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                            {activity.category}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Ages {activity.ageRange}
                          </span>
                        </div>
                        <Card.Title>{activity.title}</Card.Title>
                        <Card.Description>{activity.description}</Card.Description>
                        <div className="flex items-center mt-4 text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>Difficulty: </span>
                          <span className="ml-1 capitalize">{activity.difficulty}</span>
                        </div>
                      </Card.Content>
                      <Card.Footer>
                        <button className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          Try Activity
                        </button>
                      </Card.Footer>
                    </Card>
                  </Link>
                ) : (
                  <Card>
                    <div className="relative">
                      <Card.Image 
                        src={activity.imageUrl} 
                        alt={activity.title}
                        className="h-48 filter blur-sm"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Lock className="h-8 w-8 mx-auto mb-2" />
                          <p className="font-medium">Subscribe to Access</p>
                        </div>
                      </div>
                    </div>
                    <Card.Content>
                      <div className="flex gap-2 mb-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                          {activity.category}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Ages {activity.ageRange}
                        </span>
                      </div>
                      <Card.Title>{activity.title}</Card.Title>
                      <Card.Description>{activity.description}</Card.Description>
                    </Card.Content>
                    <Card.Footer>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => navigate('/subscription')}
                      >
                        Subscribe to Access
                      </Button>
                    </Card.Footer>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No activities found</h3>
            <p className="text-gray-500">Try adjusting your search to find something fun!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;