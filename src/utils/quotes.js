export const MOTIVATIONAL_QUOTES = [
  {
    quote: "Wealth is not about having a lot of money, it's about having a lot of options.",
    author: "Chris Rock",
    category: "wealth"
  },
  {
    quote: "The secret to wealth is simple: find a way to do more for others than anyone else does.",
    author: "Tony Robbins",
    category: "success"
  },
  {
    quote: "Kebebasan finansial adalah ketika passive income-mu lebih besar dari pengeluaranmu.",
    author: "Robert Kiyosaki",
    category: "freedom"
  },
  {
    quote: "Jangan simpan apa yang tersisa setelah belanja, tapi belanjakan apa yang tersisa setelah menabung.",
    author: "Warren Buffett",
    category: "saving"
  },
  {
    quote: "The best investment you can make is an investment in yourself.",
    author: "Warren Buffett",
    category: "investment"
  },
  {
    quote: "Do not save what is left after spending; spend what is left after saving.",
    author: "Warren Buffett",
    category: "saving"
  },
  {
    quote: "Orang kaya membangun aset. Orang miskin dan kelas menengah membangun liabilitas.",
    author: "Robert Kiyosaki",
    category: "wealth"
  },
  {
    quote: "Financial freedom is available to those who learn about it and work for it.",
    author: "Robert Kiyosaki",
    category: "freedom"
  },
  {
    quote: "The individual investor should act consistently as an investor and not as a speculator.",
    author: "Benjamin Graham",
    category: "investment"
  },
  {
    quote: "Setiap rupiah yang kamu hemat adalah langkah menuju kebebasan finansial.",
    author: "Illan's Wealth OS",
    category: "motivation"
  },
  {
    quote: "It's not how much money you make, but how much money you keep.",
    author: "Robert Kiyosaki",
    category: "wealth"
  },
  {
    quote: "Wealth consists not in having great possessions, but in having few wants.",
    author: "Epictetus",
    category: "wisdom"
  },
  {
    quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it.",
    author: "Albert Einstein",
    category: "investment"
  },
  {
    quote: "The goal isn't more money. The goal is living life on your own terms.",
    author: "Chris Brogan",
    category: "freedom"
  },
  {
    quote: "Invest in yourself. Your career is the engine of your wealth.",
    author: "Paul Clitheroe",
    category: "investment"
  },
  {
    quote: "Mulai hari ini, bukan besok. Waktu adalah aset paling berharga yang kamu miliki.",
    author: "Wealth OS",
    category: "motivation"
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    category: "investment"
  },
  {
    quote: "Never spend your money before you have it.",
    author: "Thomas Jefferson",
    category: "saving"
  },
  {
    quote: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
    category: "success"
  },
  {
    quote: "Kekayaan bukan tentang seberapa banyak kamu punya, tapi seberapa bijak kamu mengelolanya.",
    author: "Wealth OS",
    category: "wisdom"
  },
  {
    quote: "Rich people have small TVs and big libraries, and poor people have small libraries and big TVs.",
    author: "Zig Ziglar",
    category: "wisdom"
  },
  {
    quote: "The more you learn, the more you earn.",
    author: "Warren Buffett",
    category: "success"
  },
  {
    quote: "Price is what you pay. Value is what you get.",
    author: "Warren Buffett",
    category: "investment"
  },
  {
    quote: "Mimpi besar, tapi mulai dari langkah kecil hari ini.",
    author: "Wealth OS",
    category: "motivation"
  },
  {
    quote: "Money is a tool. Used properly it makes something beautiful; used wrong, it makes a mess.",
    author: "Bradley Vinson",
    category: "wisdom"
  },
  {
    quote: "You must gain control over your money or the lack of it will forever control you.",
    author: "Dave Ramsey",
    category: "control"
  },
  {
    quote: "Bukan berapa besar penghasilan yang menentukan kekayaan, tapi berapa besar yang bisa kamu kelola.",
    author: "Wealth OS",
    category: "wisdom"
  },
  {
    quote: "If you don't find a way to make money while you sleep, you will work until you die.",
    author: "Warren Buffett",
    category: "passive"
  },
  {
    quote: "Setiap hari adalah kesempatan untuk menjadi lebih kaya dari kemarin.",
    author: "Wealth OS",
    category: "motivation"
  },
  {
    quote: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
    category: "success"
  },
]

export const getDailyQuote = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]
}
