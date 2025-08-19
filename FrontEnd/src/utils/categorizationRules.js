// Auto-categorization rules for Finance Tracker
export const categorizationRules = {
  // Entertainment keywords
  entertainment: [
    "movie",
    "movies",
    "cinema",
    "theater",
    "theatre",
    "netflix",
    "spotify",
    "concert",
    "show",
    "game",
    "gaming",
    "entertainment",
    "fun",
    "party",
    "club",
    "bar",
    "pub",
    "music",
    "streaming",
    "subscription",
  ],

  // Food & Dining keywords
  food: [
    "restaurant",
    "food",
    "lunch",
    "dinner",
    "breakfast",
    "cafe",
    "coffee",
    "pizza",
    "burger",
    "groceries",
    "grocery",
    "supermarket",
    "market",
    "cooking",
    "meal",
    "snack",
    "takeout",
    "delivery",
    "uber eats",
    "zomato",
  ],

  // Transportation keywords
  transportation: [
    "fuel",
    "gas",
    "petrol",
    "diesel",
    "bus",
    "taxi",
    "uber",
    "ola",
    "metro",
    "train",
    "flight",
    "travel",
    "transport",
    "parking",
    "toll",
    "bike",
    "car",
    "vehicle",
    "maintenance",
  ],

  // Shopping keywords
  shopping: [
    "shopping",
    "clothes",
    "clothing",
    "shirt",
    "pants",
    "shoes",
    "bag",
    "accessories",
    "electronics",
    "phone",
    "laptop",
    "gadget",
    "amazon",
    "flipkart",
    "online",
    "purchase",
    "buy",
    "mall",
  ],

  // Healthcare keywords
  healthcare: [
    "doctor",
    "hospital",
    "medicine",
    "medical",
    "pharmacy",
    "health",
    "clinic",
    "checkup",
    "treatment",
    "dentist",
    "prescription",
    "insurance",
  ],

  // Bills & Utilities keywords
  utilities: [
    "electricity",
    "water",
    "gas",
    "internet",
    "wifi",
    "phone bill",
    "mobile",
    "recharge",
    "rent",
    "maintenance",
    "society",
    "bill",
    "utilities",
    "broadband",
  ],

  // Income keywords
  salary: [
    "salary",
    "wage",
    "income",
    "bonus",
    "commission",
    "freelance",
    "project",
    "work",
    "payment",
    "earning",
    "allowance",
  ],
};

// Function to auto-categorize based on notes/description
export const autoCategory = (notes, type = "expense") => {
  if (!notes || notes.trim() === "") return "";

  const lowerCaseNotes = notes.toLowerCase();

  // Check each category for matching keywords
  for (const [category, keywords] of Object.entries(categorizationRules)) {
    // Skip salary category for expenses
    if (type === "expense" && category === "salary") continue;

    for (const keyword of keywords) {
      if (lowerCaseNotes.includes(keyword)) {
        // Return capitalized category name
        return category.charAt(0).toUpperCase() + category.slice(1);
      }
    }
  }

  return ""; // Return empty string if no match found
};
