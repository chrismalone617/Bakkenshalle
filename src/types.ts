export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: 'Drilling' | 'Jobs' | 'Midstream' | 'General';
  date: string;
  imageUrl?: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Operator' | 'Services' | 'Midstream';
  postedAt: string;
}

export interface MarketStat {
  label: string;
  value: string;
  change: number;
  unit?: string;
}
