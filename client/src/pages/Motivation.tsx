import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

const Motivation: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // In a real implementation, we'd fetch this from an API
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['/api/motivation/quotes'],
    queryFn: async () => {
      // For demo purposes
      return [
        { id: 1, text: "Every time you resist temptation, you become stronger than you were before.", author: "Anonymous", category: "recovery" },
        { id: 2, text: "The pain of discipline is far less than the pain of regret.", author: "Jim Rohn", category: "discipline" },
        { id: 3, text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", category: "progress" },
        { id: 4, text: "The first and greatest victory is to conquer yourself.", author: "Plato", category: "recovery" },
        { id: 5, text: "Recovery is not for people who need it, it's for people who want it.", author: "Anonymous", category: "recovery" },
        { id: 6, text: "Nothing is impossible. The word itself says 'I'm possible!'", author: "Audrey Hepburn", category: "inspiration" },
        { id: 7, text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "progress" },
        { id: 8, text: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou", category: "resilience" }
      ];
    }
  });

  // Filter quotes by selected category
  const filteredQuotes = quotes?.filter(quote => 
    selectedCategory === 'all' || quote.category === selectedCategory
  );

  // Get unique categories
  const categories = quotes ? ['all', ...new Set(quotes.map(quote => quote.category))] : ['all'];

  return (
    <div className="flex-1 p-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Motivation</h1>
        <p className="text-slate-500 mt-1">Inspiration to help you stay on track</p>
      </header>

      {/* Daily Inspiration */}
      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <CardTitle className="text-center">Today's Inspiration</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-slate-100 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-slate-100 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-slate-100 rounded w-1/4 mx-auto mt-4"></div>
            </div>
          ) : (
            <>
              <blockquote className="text-2xl italic font-medium text-slate-800 mb-4">
                "Recovery is not just about stopping; it's about starting a new way of living."
              </blockquote>
              <p className="text-slate-500">— Recovery Wisdom</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quote Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-1/4 mt-4"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredQuotes?.map(quote => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <blockquote className="italic text-slate-700 mb-2">"{quote.text}"</blockquote>
                <p className="text-sm text-slate-500">— {quote.author}</p>
                <div className="mt-3">
                  <span className="inline-block bg-slate-100 rounded-full px-3 py-1 text-xs font-medium text-slate-600 capitalize">
                    {quote.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Benefits Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Benefits of Beating Porn Addiction</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <i className="fas fa-brain text-xl"></i>
              </div>
              <h3 className="font-medium text-slate-800 mb-2">Improved Brain Function</h3>
              <p className="text-sm text-slate-600">
                Recovery allows your dopamine system to rebalance, improving concentration, memory, and decision-making.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <i className="fas fa-heart text-xl"></i>
              </div>
              <h3 className="font-medium text-slate-800 mb-2">Healthier Relationships</h3>
              <p className="text-sm text-slate-600">
                Breaking free from porn addiction leads to more authentic connections and deeper intimacy in relationships.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <h3 className="font-medium text-slate-800 mb-2">Increased Energy</h3>
              <p className="text-sm text-slate-600">
                Many report significant energy boosts and higher motivation for productive activities after quitting porn.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4">
                <i className="fas fa-sun text-xl"></i>
              </div>
              <h3 className="font-medium text-slate-800 mb-2">Better Self-Esteem</h3>
              <p className="text-sm text-slate-600">
                Breaking free from shame cycles leads to improved self-worth and a more positive self-image.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <i className="fas fa-clock text-xl"></i>
              </div>
              <h3 className="font-medium text-slate-800 mb-2">More Time</h3>
              <p className="text-sm text-slate-600">
                Reclaim hours of your day that were previously lost to seeking and consuming pornographic content.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                <i className="fas fa-trophy text-xl"></i>
              </div>
              <h3 className="font-medium text-slate-800 mb-2">Greater Self-Control</h3>
              <p className="text-sm text-slate-600">
                The discipline developed through recovery transfers to other areas of life, creating a positive feedback loop.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Motivation;
