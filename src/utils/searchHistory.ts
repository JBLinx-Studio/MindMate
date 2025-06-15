
export interface SearchHistoryItem {
  id: string;
  query: string;
  type: 'player' | 'game' | 'opening' | 'position';
  timestamp: string;
  results?: number;
}

class SearchHistoryManager {
  private storageKey = 'chess-search-history';
  private maxHistoryItems = 100;

  getSearchHistory(): SearchHistoryItem[] {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  addSearchQuery(query: string, type: SearchHistoryItem['type'], results?: number): void {
    const history = this.getSearchHistory();
    
    // Remove duplicate if exists
    const filteredHistory = history.filter(item => 
      !(item.query.toLowerCase() === query.toLowerCase() && item.type === type)
    );
    
    const newItem: SearchHistoryItem = {
      id: `search_${Date.now()}`,
      query,
      type,
      timestamp: new Date().toISOString(),
      results,
    };
    
    // Add to beginning of array
    const updatedHistory = [newItem, ...filteredHistory].slice(0, this.maxHistoryItems);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  getRecentSearches(type?: SearchHistoryItem['type'], limit: number = 10): SearchHistoryItem[] {
    const history = this.getSearchHistory();
    const filtered = type ? history.filter(item => item.type === type) : history;
    return filtered.slice(0, limit);
  }

  clearSearchHistory(): void {
    localStorage.removeItem(this.storageKey);
  }

  removeSearchItem(id: string): void {
    const history = this.getSearchHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedHistory));
  }

  getPopularSearches(type?: SearchHistoryItem['type']): { query: string; count: number }[] {
    const history = this.getSearchHistory();
    const filtered = type ? history.filter(item => item.type === type) : history;
    
    const queryCount = new Map<string, number>();
    filtered.forEach(item => {
      const query = item.query.toLowerCase();
      queryCount.set(query, (queryCount.get(query) || 0) + 1);
    });
    
    return Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const searchHistoryManager = new SearchHistoryManager();
