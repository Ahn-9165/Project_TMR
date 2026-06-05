import { WeatherType } from '../weather/weather.types';

export type FoodCategory =
  | 'any'
  | 'korean'
  | 'western'
  | 'japanese'
  | 'chinese'
  | 'chicken'
  | 'pizza'
  | 'burger';

export type AlcoholType =
  | 'any'
  | 'soju'
  | 'beer'
  | 'makgeolli'
  | 'wine'
  | 'whiskey'
  | 'cocktail';

export interface FoodMenu {
  name: string;
  category: FoodCategory;
  alcoholMatches: AlcoholType[];
  weatherMatches: WeatherType[];
  tempMin?: number;
  tempMax?: number;
  tags: string[];
  searchKeywords: string[];
}

export interface AlcoholBrand {
  type: AlcoholType;
  label: string;
  brands: string[];
  matchTags: string[];
}

export const FOOD_MENUS: FoodMenu[] = [
  {
    name: '삼겹살',
    category: 'korean',
    alcoholMatches: ['soju', 'beer'],
    weatherMatches: ['Clear', 'Cold', 'Any'],
    tags: ['grill', 'heavy', 'korean'],
    searchKeywords: ['삼겹살'],
  },
  {
    name: '김치찜',
    category: 'korean',
    alcoholMatches: ['soju', 'makgeolli'],
    weatherMatches: ['Rain', 'Cold'],
    tempMax: 18,
    tags: ['spicy', 'soup', 'korean'],
    searchKeywords: ['김치찜', '김치찌개'],
  },
  {
    name: '닭발',
    category: 'korean',
    alcoholMatches: ['soju', 'beer'],
    weatherMatches: ['Rain', 'Cold', 'Clear'],
    tags: ['spicy', 'late-night', 'korean'],
    searchKeywords: ['닭발'],
  },
  {
    name: '김밥',
    category: 'korean',
    alcoholMatches: ['soju', 'beer'],
    weatherMatches: ['Rain', 'Cold', 'Clear'],
    tags: ['spicy', 'late-night', 'korean'],
    searchKeywords: ['김밥'],
  },
  {
    name: '오돌뼈',
    category: 'korean',
    alcoholMatches: ['soju', 'beer'],
    weatherMatches: ['Clear', 'Rain'],
    tags: ['spicy', 'grill', 'korean'],
    searchKeywords: ['오돌뼈'],
  },
  {
    name: '곱창',
    category: 'korean',
    alcoholMatches: ['soju', 'beer'],
    weatherMatches: ['Cold', 'Clear'],
    tags: ['grill', 'rich', 'korean'],
    searchKeywords: ['곱창'],
  },
  {
    name: '해물파전',
    category: 'korean',
    alcoholMatches: ['makgeolli'],
    weatherMatches: ['Rain', 'Snow'],
    tempMax: 22,
    tags: ['rainy', 'savory', 'classic'],
    searchKeywords: ['파전', '해물파전'],
  },
  {
    name: '감자탕',
    category: 'korean',
    alcoholMatches: ['soju', 'beer'],
    weatherMatches: ['Cold', 'Snow', 'Rain'],
    tempMax: 16,
    tags: ['soup', 'warm', 'heavy'],
    searchKeywords: ['감자탕'],
  },
  {
    name: '치킨',
    category: 'chicken',
    alcoholMatches: ['beer', 'soju'],
    weatherMatches: ['Clear', 'Rain', 'Any'],
    tags: ['fried', 'delivery', 'casual'],
    searchKeywords: ['치킨'],
  },
  {
    name: '파스타',
    category: 'western',
    alcoholMatches: ['wine', 'beer'],
    weatherMatches: ['Clear', 'Cloudy', 'Any'],
    tags: ['western', 'date', 'soft'],
    searchKeywords: ['파스타'],
  },
  {
    name: '스테이크',
    category: 'western',
    alcoholMatches: ['wine', 'whiskey'],
    weatherMatches: ['Clear', 'Cold', 'Any'],
    tags: ['western', 'rich', 'grill'],
    searchKeywords: ['스테이크'],
  },
  {
    name: '피자',
    category: 'pizza',
    alcoholMatches: ['beer', 'wine'],
    weatherMatches: ['Clear', 'Rain', 'Any'],
    tags: ['western', 'share', 'casual'],
    searchKeywords: ['피자'],
  },
  {
    name: '수제버거',
    category: 'burger',
    alcoholMatches: ['beer', 'whiskey'],
    weatherMatches: ['Clear', 'Hot', 'Any'],
    tags: ['burger', 'casual', 'western'],
    searchKeywords: ['수제버거', '햄버거'],
  },
  {
    name: '감바스',
    category: 'western',
    alcoholMatches: ['wine', 'cocktail'],
    weatherMatches: ['Hot', 'Clear', 'Any'],
    tags: ['seafood', 'light', 'western'],
    searchKeywords: ['감바스'],
  },
  {
    name: '사시미',
    category: 'japanese',
    alcoholMatches: ['soju', 'beer', 'wine'],
    weatherMatches: ['Hot', 'Clear'],
    tags: ['fresh', 'light', 'japanese'],
    searchKeywords: ['사시미', '횟집'],
  },
  {
    name: '이자카야 꼬치',
    category: 'japanese',
    alcoholMatches: ['beer', 'whiskey', 'soju'],
    weatherMatches: ['Clear', 'Cold', 'Any'],
    tags: ['grill', 'japanese', 'bar'],
    searchKeywords: ['이자카야', '꼬치'],
  },
  {
    name: '마라샹궈',
    category: 'chinese',
    alcoholMatches: ['beer', 'soju'],
    weatherMatches: ['Rain', 'Cold', 'Clear'],
    tags: ['spicy', 'chinese', 'heavy'],
    searchKeywords: ['마라샹궈'],
  },
  {
    name: '양꼬치',
    category: 'chinese',
    alcoholMatches: ['beer', 'soju'],
    weatherMatches: ['Cold', 'Clear', 'Any'],
    tags: ['grill', 'chinese', 'spicy'],
    searchKeywords: ['양꼬치'],
  },
  {
    name: '타파스',
    category: 'western',
    alcoholMatches: ['cocktail', 'wine'],
    weatherMatches: ['Clear', 'Hot', 'Any'],
    tags: ['light', 'bar', 'western'],
    searchKeywords: ['타파스', '와인바'],
  },
];

export const ALCOHOL_BRANDS: AlcoholBrand[] = [
  {
    type: 'soju',
    label: '소주',
    brands: ['참이슬', '처음처럼', '진로이즈백', '새로', '좋은데이'],
    matchTags: ['spicy', 'soup', 'grill', 'korean'],
  },
  {
    type: 'beer',
    label: '맥주',
    brands: ['카스', '테라', '켈리', '클라우드', '크러시'],
    matchTags: ['fried', 'casual', 'spicy', 'western'],
  },
  {
    type: 'makgeolli',
    label: '막걸리',
    brands: ['장수막걸리', '지평막걸리', '느린마을막걸리', '해창막걸리', '복순도가'],
    matchTags: ['rainy', 'savory', 'korean', 'classic'],
  },
  {
    type: 'wine',
    label: '와인',
    brands: ['몬테스 알파', '1865', 'G7', '옐로우 테일', '카시예로 델 디아블로'],
    matchTags: ['western', 'light', 'seafood', 'date'],
  },
  {
    type: 'whiskey',
    label: '양주',
    brands: ['발렌타인', '조니워커', '잭다니엘', '짐빔', '제임슨'],
    matchTags: ['bar', 'grill', 'rich', 'burger'],
  },
  {
    type: 'cocktail',
    label: '칵테일',
    brands: ['하이볼', '진토닉', '모히또', '마티니', '피치크러시'],
    matchTags: ['bar', 'light', 'western', 'casual'],
  },
];
