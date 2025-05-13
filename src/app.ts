// Define the interface for the API response
interface StockQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

// Stock data model
interface StockData {
  symbol: string;
  open: string;
  high: string;
  low: string;
  price: string;
  volume: string;
  latestTradingDay: string;
  previousClose: string;
  change: string;
  changePercent: string;
}

// Define API constants
const API_BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = 'FA54WOF0WL4AXE3K'; // For testing purposes, will replace with real key later
const USE_MOCK_DATA = true; // Set to false to use actual API data

// Mock data for testing when API is unavailable
const MOCK_DATA: StockData = {
  symbol: 'IBM',
  open: '252.50',
  high: '253.81',
  low: '244.65',
  price: '253.69',
  volume: '4609520',
  latestTradingDay: '2025-05-12',
  previousClose: '249.20',
  change: '4.49',
  changePercent: '1.8018%'
};

// Cache to store previous searches and reduce API calls
const cache: { [key: string]: { data: StockData, timestamp: number } } = {};
const CACHE_EXPIRY = 60000; // Cache expiry time in milliseconds (1 minute)

// DOM Elements
const stockSymbolInput = document.getElementById('stock-symbol') as HTMLInputElement;
const searchButton = document.getElementById('search-button') as HTMLButtonElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;
const resultsSection = document.getElementById('results-section') as HTMLElement;
const loadingSpinner = document.getElementById('loading-spinner') as HTMLElement;

// Company info elements
const companyName = document.getElementById('company-name') as HTMLElement;
const companySymbol = document.getElementById('company-symbol') as HTMLElement;

// Price info elements
const currentPrice = document.getElementById('current-price') as HTMLElement;
const priceChange = document.getElementById('price-change') as HTMLElement;
const changePercent = document.getElementById('change-percent') as HTMLElement;

// Additional info elements
const openPrice = document.getElementById('open-price') as HTMLElement;
const highPrice = document.getElementById('high-price') as HTMLElement;
const lowPrice = document.getElementById('low-price') as HTMLElement;
const prevClose = document.getElementById('prev-close') as HTMLElement;
const volume = document.getElementById('volume') as HTMLElement;
const tradingDay = document.getElementById('trading-day') as HTMLElement;

// Event listeners
searchButton.addEventListener('click', handleSearch);
stockSymbolInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Format numeric values
function formatPrice(priceStr: string): string {
  const price = parseFloat(priceStr);
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price);
}

function formatVolume(volumeStr: string): string {
  const volume = parseInt(volumeStr, 10);
  // Format the number with commas (without the compact notation that may not be supported)
  return new Intl.NumberFormat('en-US').format(volume);
}

function formatChangePercent(percentStr: string): string {
  // Remove the % character from the string and parse
  const percent = parseFloat(percentStr.replace('%', ''));
  return `${percent.toFixed(2)}%`;
}

// Function to handle the search action
async function handleSearch() {
  const symbol = stockSymbolInput.value.trim().toUpperCase();
  
  if (!symbol) {
    showError('Please enter a stock symbol');
    return;
  }
  
  clearError();
  showLoading();
  hideResults();
  
  try {
    // Use mock data if flag is set to true, with a small delay to simulate network request
    let stockData;
    if (USE_MOCK_DATA) {
      // Add a small delay when using mock data to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      stockData = getMockData(symbol);
    } else {
      stockData = await fetchStockData(symbol);
    }
    
    displayStockData(stockData);
  } catch (error) {
    console.error('Error during search:', error);
    // Handle any errors that occurred during the fetch
    showError(`Error fetching stock data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    hideLoading();
  }
}

// Function to get mock data (for testing/development)
function getMockData(symbol: string): StockData {
  console.log('Using mock data for symbol:', symbol);
  // Return a copy of the mock data with the requested symbol
  return { ...MOCK_DATA, symbol };
}

// Function to fetch stock data from the API
async function fetchStockData(symbol: string): Promise<StockData> {
  console.log('Fetching data for symbol:', symbol);
  
  // Check cache first
  const now = Date.now();
  if (cache[symbol] && (now - cache[symbol].timestamp) < CACHE_EXPIRY) {
    console.log('Using cached data for', symbol);
    return cache[symbol].data;
  }
  
  // Construct the API URL
  const url = `${API_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  console.log('API URL:', url);
  
  try {
    // Make the API call
    const response = await fetch(url);
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    
    // Check if the API returned valid data
    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid symbol or no data available');
    }
    
    // Transform the API response to our StockData interface
    const quote = data['Global Quote'];
    const stockData: StockData = {
      symbol: quote['01. symbol'],
      open: quote['02. open'],
      high: quote['03. high'],
      low: quote['04. low'],
      price: quote['05. price'],
      volume: quote['06. volume'],
      latestTradingDay: quote['07. latest trading day'],
      previousClose: quote['08. previous close'],
      change: quote['09. change'],
      changePercent: quote['10. change percent']
    };
    
    // Update cache
    cache[symbol] = {
      data: stockData,
      timestamp: now
    };
    
    return stockData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

// Function to display the stock data in the UI
function displayStockData(data: StockData) {
  console.log('Displaying stock data:', data);
  
  // Update company information
  companyName.textContent = data.symbol; // Using symbol as name since API doesn't provide company name
  companySymbol.textContent = `Symbol: ${data.symbol}`;
  
  // Update price information
  currentPrice.textContent = formatPrice(data.price);
  
  const changeValue = parseFloat(data.change);
  priceChange.textContent = formatPrice(data.change);
  priceChange.className = 'change ' + (changeValue >= 0 ? 'positive' : 'negative');
  
  changePercent.textContent = formatChangePercent(data.changePercent);
  changePercent.className = 'change-percent ' + (changeValue >= 0 ? 'positive' : 'negative');
  
  // Update additional information
  openPrice.textContent = formatPrice(data.open);
  highPrice.textContent = formatPrice(data.high);
  lowPrice.textContent = formatPrice(data.low);
  prevClose.textContent = formatPrice(data.previousClose);
  volume.textContent = formatVolume(data.volume);
  tradingDay.textContent = formatDate(data.latestTradingDay);
  
  // Important: First hide the loading spinner and THEN show the results
  hideLoading();
  showResults();
}

// Helper function to format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr; // Return the original string if formatting fails
  }
}

// UI helper functions
function showError(message: string) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  hideLoading(); // Make sure loading spinner is hidden when showing errors
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

function showLoading() {
  loadingSpinner.classList.remove('hidden');
  console.log('Loading spinner shown');
}

function hideLoading() {
  loadingSpinner.classList.add('hidden');
  console.log('Loading spinner hidden');
  
  // Make extra sure the spinner is hidden
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }
}

function showResults() {
  resultsSection.classList.remove('hidden');
  console.log('Results section shown');
}

function hideResults() {
  resultsSection.classList.add('hidden');
  console.log('Results section hidden');
}

// Initialize with some data if there's already a value in the input field
window.addEventListener('DOMContentLoaded', () => {
  if (stockSymbolInput.value.trim()) {
    handleSearch();
  }
});
