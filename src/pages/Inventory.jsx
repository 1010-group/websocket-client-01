import React, { useState } from "react";
import { ShoppingBag, Package, Star, Zap, Crown, Palette, Volume2, Frame, MessageCircle, Shield, Smartphone, Sparkles } from "lucide-react";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [coins, setCoins] = useState(1250);
  
  // User's inventory items
  const [inventory, setInventory] = useState([
    { id: "name-red", name: "Red Name", color: "text-red-500", icon: "🟥", type: "username", rarity: "Rare" },
    { id: "frame-gold", name: "Gold Frame", color: "ring-yellow-400", icon: "🥇", type: "avatarFrame", rarity: "Gold" },
    { id: "emote-fire", name: "🔥 Fire", color: "text-red-500", icon: "🔥", type: "emote", rarity: "Silver" },
    { id: "sound-bell", name: "Bell Ring", color: "text-yellow-400", icon: "🔔", type: "sound", rarity: "Rare" },
  ]);

  const handleBuy = (item) => {
    if (coins >= item.price) {
      setCoins(coins - item.price);
      setInventory([...inventory, item]);
      // You can add toast here if available
    }
  };

  const shopCategories = [
    { id: "all", name: "All Items", icon: <Sparkles className="w-4 h-4" /> },
    { id: "username", name: "Username Colors", icon: <Palette className="w-4 h-4" /> },
    { id: "nameShadow", name: "Name Shadows", icon: <Zap className="w-4 h-4" /> },
    { id: "avatarFrame", name: "Avatar Frames", icon: <Frame className="w-4 h-4" /> },
    { id: "emote", name: "Emotes", icon: <Star className="w-4 h-4" /> },
    { id: "sound", name: "Sounds", icon: <Volume2 className="w-4 h-4" /> },
    { id: "border", name: "Borders", icon: <Shield className="w-4 h-4" /> },
    { id: "chatBubble", name: "Chat Bubbles", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "roleIcon", name: "Role Icons", icon: <Crown className="w-4 h-4" /> },
    { id: "theme", name: "UI Themes", icon: <Smartphone className="w-4 h-4" /> },
  ];

  const shopItems = [
    // Username Colors
    { id: "name-red", name: "Red Name", color: "text-red-500", icon: "🟥", price: 100, rarity: "Rare", type: "username" },
    { id: "name-blue", name: "Blue Name", color: "text-blue-500", icon: "🟦", price: 90, rarity: "Silver", type: "username" },
    { id: "name-green", name: "Green Name", color: "text-green-500", icon: "🟩", price: 110, rarity: "Rare", type: "username" },
    { id: "name-gold", name: "Gold Name", color: "text-yellow-400", icon: "🟨", price: 140, rarity: "Gold", type: "username" },
    { id: "name-purple", name: "Purple Name", color: "text-purple-500", icon: "🟪", price: 130, rarity: "Epic", type: "username" },
    { id: "name-platinum", name: "Platinum Name", color: "text-gray-200", icon: "⬜", price: 160, rarity: "Platinum", type: "username" },
    
    // Name Shadows
    { id: "shadow-glow", name: "Glow Shadow", color: "text-cyan-400", icon: "🌟", price: 140, rarity: "Epic", type: "nameShadow" },
    { id: "shadow-dark", name: "Dark Shadow", color: "text-gray-600", icon: "🌑", price: 160, rarity: "Legendary", type: "nameShadow" },
    { id: "shadow-light", name: "Light Shadow", color: "text-yellow-200", icon: "💡", price: 120, rarity: "Gold", type: "nameShadow" },
    
    // Avatar Frames
    { id: "frame-gold", name: "Gold Frame", color: "ring-yellow-400", icon: "🥇", price: 200, rarity: "Gold", type: "avatarFrame" },
    { id: "frame-silver", name: "Silver Frame", color: "ring-gray-300", icon: "🥈", price: 150, rarity: "Silver", type: "avatarFrame" },
    { id: "frame-neon", name: "Neon Frame", color: "ring-cyan-400", icon: "✨", price: 220, rarity: "Epic", type: "avatarFrame" },
    
    // Emotes
    { id: "emote-fire", name: "🔥 Fire", color: "text-red-500", icon: "🔥", price: 80, rarity: "Silver", type: "emote" },
    { id: "emote-crown", name: "👑 Crown", color: "text-yellow-400", icon: "👑", price: 200, rarity: "Legendary", type: "emote" },
    { id: "emote-dragon", name: "🐉 Dragon", color: "text-green-400", icon: "🐉", price: 250, rarity: "Platinum", type: "emote" },
    
    // Sounds
    { id: "sound-ding", name: "Ding Sound", color: "text-blue-400", icon: "🎶", price: 80, rarity: "Silver", type: "sound" },
    { id: "sound-laser", name: "Laser Ping", color: "text-cyan-400", icon: "🔊", price: 120, rarity: "Epic", type: "sound" },
    { id: "sound-bell", name: "Bell Ring", color: "text-yellow-400", icon: "🔔", price: 100, rarity: "Rare", type: "sound" },
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Bronze": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "Silver": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "Rare": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Gold": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Epic": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Legendary": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Platinum": return "bg-white/20 text-white border-white/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const filteredItems = selectedCategory === "all" 
    ? shopItems 
    : shopItems.filter(item => item.type === selectedCategory);

  const isOwned = (itemId) => inventory.some(item => item.id === itemId);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Customization Hub
              </h1>
              
              {/* Tab Navigation */}
              <div className="flex bg-white/5 rounded-full p-1">
                <button
                  onClick={() => setActiveTab("shop")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                    activeTab === "shop"
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </button>
                <button
                  onClick={() => setActiveTab("inventory")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                    activeTab === "inventory"
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Inventory ({inventory.length})
                </button>
              </div>
            </div>
            
            {/* Coins */}
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-black">
                💰
              </div>
              <span className="text-yellow-300 font-bold">{coins.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "shop" ? (
          <div>
            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
              <div className="flex flex-wrap gap-3">
                {shopCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      selectedCategory === category.id
                        ? "bg-purple-500 text-white shadow-lg"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  {/* Rarity Glow */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity ${
                    item.rarity === "Legendary" ? "bg-red-500/30" :
                    item.rarity === "Epic" ? "bg-purple-500/30" :
                    item.rarity === "Gold" ? "bg-yellow-500/30" :
                    "bg-blue-500/30"
                  }`} />
                  
                  {/* Item Icon */}
                  <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  
                  {/* Item Info */}
                  <h3 className={`text-lg font-bold text-center mb-2 ${item.color}`}>
                    {item.name}
                  </h3>
                  
                  {/* Rarity Badge */}
                  <div className="flex justify-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center mb-4">
                    <span className="text-yellow-300 font-bold text-lg">{item.price}</span>
                    <span className="text-gray-400 ml-1">coins</span>
                  </div>
                  
                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={isOwned(item.id) || coins < item.price}
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      isOwned(item.id)
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
                        : coins < item.price
                        ? "bg-gray-500/20 text-gray-500 border border-gray-500/30 cursor-not-allowed"
                        : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-purple-500/25"
                    }`}
                  >
                    {isOwned(item.id) ? "✓ Owned" : coins < item.price ? "Not enough coins" : "Buy Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Inventory Tab */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Your Collection</h2>
              <p className="text-gray-400">Manage and equip your customization items</p>
            </div>

            {inventory.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Your inventory is empty</h3>
                <p className="text-gray-500 mb-6">Start shopping to collect awesome customization items!</p>
                <button
                  onClick={() => setActiveTab("shop")}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Browse Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300"
                  >
                    {/* Equipped Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full text-xs font-medium">
                        Owned
                      </div>
                    </div>
                    
                    {/* Item Icon */}
                    <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    
                    {/* Item Info */}
                    <h3 className={`text-lg font-bold text-center mb-2 ${item.color}`}>
                      {item.name}
                    </h3>
                    
                    {/* Rarity Badge */}
                    <div className="flex justify-center mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.rarity)}`}>
                        {item.rarity}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                        Equip
                      </button>
                      <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium transition-colors">
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;