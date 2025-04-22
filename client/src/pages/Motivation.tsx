import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

const Motivation: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // In a real implementation, we'd fetch this from an API
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['/api/motivation/quotes'],
    queryFn: async () => {
      // Islamic quotes and hadith
      return [
        { id: 1, text: "Every soul will taste death. Then to Us will you be returned.", author: "Quran 29:57", category: "quran" },
        { id: 2, text: "Verily, with hardship comes ease.", author: "Quran 94:5", category: "quran" },
        { id: 3, text: "Allah does not burden a soul beyond that it can bear.", author: "Quran 2:286", category: "quran" },
        { id: 4, text: "Indeed, Allah will not change the condition of a people until they change what is in themselves.", author: "Quran 13:11", category: "quran" },
        { id: 5, text: "Whoever lowers his gaze from what Allah has forbidden, Allah will reward him with illumined vision.", author: "Hadith", category: "hadith" },
        { id: 6, text: "The strongest among you is the one who controls himself when he is angry.", author: "Prophet Muhammad ﷺ", category: "hadith" },
        { id: 7, text: "Make things easier, do not make things more difficult, spread the glad tidings, do not hate.", author: "Prophet Muhammad ﷺ", category: "hadith" },
        { id: 8, text: "He who abandons something for the sake of Allah, He compensates him with something better than it.", author: "Hadith", category: "hadith" },
        { id: 9, text: "Be in this world as if you were a stranger or a traveler.", author: "Prophet Muhammad ﷺ", category: "hadith" },
        { id: 10, text: "Patience is beautiful.", author: "Quran 12:18", category: "quran" },
        { id: 11, text: "Remember Me, and I will remember you.", author: "Quran 2:152", category: "quran" },
        { id: 12, text: "And seek help through patience and prayer.", author: "Quran 2:45", category: "quran" }
      ];
    }
  });

  // Filter quotes by selected category
  const filteredQuotes = quotes?.filter(quote => 
    selectedCategory === 'all' || quote.category === selectedCategory
  );

  // Get unique categories
  const categories = quotes 
    ? ['all', ...Array.from(new Set(quotes.map(quote => quote.category)))] 
    : ['all'];

  return (
    <div className="flex-1 p-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Islamic Guidance</h1>
        <p className="text-muted-foreground mt-1">Inspiration from the Quran and Sunnah to help you stay on the right path</p>
      </header>

      {/* Daily Inspiration */}
      <Card className="mb-8 border-2 border-primary/20 dark:border-primary/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
          <CardTitle className="text-center text-lg md:text-xl">
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Today's Quranic Guidance
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-primary/10 dark:bg-primary/5 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-primary/10 dark:bg-primary/5 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-primary/10 dark:bg-primary/5 rounded w-1/4 mx-auto mt-4"></div>
            </div>
          ) : (
            <>
              <blockquote className="text-xl md:text-2xl italic font-medium text-foreground mb-4 leading-relaxed">
                "And lower your gaze and guard your modesty: that is purer for you. Indeed, Allah is well-acquainted with what you do."
              </blockquote>
              <p className="text-muted-foreground font-semibold">— Quran 24:30</p>
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
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                : 'bg-background border border-border text-foreground hover:bg-accent/10'
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
            <Card key={i} className="animate-pulse dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-100 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-100 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-slate-100 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-100 dark:bg-gray-700 rounded w-1/4 mt-4"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredQuotes?.map(quote => (
            <Card key={quote.id} className="card-hover border border-border/40">
              <CardContent className="p-6">
                <blockquote className="italic text-foreground mb-2">"{quote.text}"</blockquote>
                <p className="text-sm text-muted-foreground">— {quote.author}</p>
                <div className="mt-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize
                    ${quote.category === 'quran' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-accent/10 text-accent'
                    }`}>
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
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">Islamic Guidance for Battling Temptation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-hover border border-border/40">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-medium text-foreground mb-2">Lowering Your Gaze</h3>
              <p className="text-sm text-muted-foreground">
                Allah commands believers to lower their gaze from haram (forbidden) content, which helps purify the heart and protect from sin.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover border border-border/40">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-foreground mb-2">Stronger Faith</h3>
              <p className="text-sm text-muted-foreground">
                Resisting temptation for Allah's sake strengthens iman (faith) and builds a more profound connection with your Creator.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover border border-border/40">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-foreground mb-2">Taqwa Development</h3>
              <p className="text-sm text-muted-foreground">
                Avoiding sins helps develop taqwa (God-consciousness), which the Quran describes as the best provision for the Hereafter.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover border border-border/40">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-medium text-foreground mb-2">Blessed Marriage</h3>
              <p className="text-sm text-muted-foreground">
                Protecting yourself from zina (unlawful intercourse) and impure thoughts helps prepare for a blessed and fulfilling marriage.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover border border-border/40">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-medium text-foreground mb-2">Improved Worship</h3>
              <p className="text-sm text-muted-foreground">
                Abstaining from sins leads to more focused and meaningful salah (prayer) and strengthens your spiritual connection.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover border border-border/40">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-medium text-foreground mb-2">Divine Rewards</h3>
              <p className="text-sm text-muted-foreground">
                The Prophet ﷺ taught that whoever avoids sin for Allah's sake will be rewarded with something better in return.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Motivation;
