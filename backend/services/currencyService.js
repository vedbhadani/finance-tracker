const axios = require("axios");

const getExchangeRate = async (fromCurrency) => {
  const baseCurrency = process.env.BASE_CURRENCY || "INR";

  if (fromCurrency === baseCurrency) return 1.0;

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    // Using ExchangeRate-API (Free tier)
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${baseCurrency}`;

    const response = await axios.get(url);

    if (response.data && response.data.result === "success") {
      return response.data.conversion_rate;
    }

    throw new Error("Failed to fetch exchange rate");
  } catch (error) {
    console.error("Currency Conversion Error:", error.message);
    // Return a default or fallback if API fails?
    // For now, let's throw to ensure data integrity
    throw new Error("Currency conversion service unavailable");
  }
};

const convertAmount = async (amount, fromCurrency) => {
  const rate = await getExchangeRate(fromCurrency);
  return {
    convertedAmount: amount * rate,
    exchangeRate: rate,
  };
};

module.exports = {
  getExchangeRate,
  convertAmount,
};
