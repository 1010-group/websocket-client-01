import React from "react";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Shop() {
  const handleBuy = (item) => {
    toast.success(`✅ ${item.name} sotib olindi!`);
  };
  const shopChests = [
    {
      category: "🎨 Username Colors",
      icon: "🎨",
      type: "username",
      items: [
        { id: "name-red", name: "Red Name", color: "text-error", icon: "🟥", price: 100, rarity: "Rare" },
        { id: "name-blue", name: "Blue Name", color: "text-primary", icon: "🟦", price: 90, rarity: "Silver" },
        { id: "name-green", name: "Green Name", color: "text-success", icon: "🟩", price: 110, rarity: "Rare" },
        { id: "name-gold", name: "Gold Name", color: "text-yellow-400", icon: "🟨", price: 140, rarity: "Gold" },
        { id: "name-purple", name: "Purple Name", color: "text-purple-500", icon: "🟪", price: 130, rarity: "Epic" },
        { id: "name-platinum", name: "Platinum Name", color: "text-white", icon: "⬜", price: 160, rarity: "Platinum" },
      ],
    },
    {
      category: "🌀 Name Shadows",
      icon: "🌀",
      type: "nameShadow",
      items: [
        { id: "shadow-glow", name: "Glow Shadow", color: "text-shadow-accent", icon: "🌟", price: 140, rarity: "Epic" },
        { id: "shadow-dark", name: "Dark Shadow", color: "text-shadow-error", icon: "🌑", price: 160, rarity: "Legendary" },
        { id: "shadow-light", name: "Light Shadow", color: "text-shadow-white", icon: "💡", price: 120, rarity: "Gold" },
        { id: "shadow-mystic", name: "Mystic Shadow", color: "text-shadow-purple", icon: "🔮", price: 170, rarity: "Platinum" },
        { id: "shadow-blue", name: "Blue Shadow", color: "text-shadow-primary", icon: "💧", price: 100, rarity: "Silver" },
        { id: "shadow-green", name: "Green Shadow", color: "text-shadow-success", icon: "🍃", price: 110, rarity: "Rare" },
      ],
    },
    {
      category: "🛡 Avatar Frames",
      icon: "🛡",
      type: "avatarFrame",
      items: [
        { id: "frame-gold", name: "Gold Frame", color: "ring-yellow-400", icon: "🥇", price: 200, rarity: "Gold" },
        { id: "frame-silver", name: "Silver Frame", color: "ring-gray-300", icon: "🥈", price: 150, rarity: "Silver" },
        { id: "frame-bronze", name: "Bronze Frame", color: "ring-orange-700", icon: "🥉", price: 100, rarity: "Bronze" },
        { id: "frame-neon", name: "Neon Frame", color: "ring-cyan-400", icon: "✨", price: 220, rarity: "Epic" },
        { id: "frame-platinum", name: "Platinum Frame", color: "ring-white", icon: "💎", price: 300, rarity: "Platinum" },
        { id: "frame-rainbow", name: "Rainbow Frame", color: "ring-gradient-to-r from-red-500 to-blue-500", icon: "🌈", price: 250, rarity: "Legendary" },
      ],
    },
    {
      category: "📦 Loot Emotes",
      icon: "😎",
      type: "emote",
      items: [
        { id: "emote-fire", name: "🔥 Fire", color: "text-red-500", icon: "🔥", price: 80, rarity: "Silver" },
        { id: "emote-crown", name: "👑 Crown", color: "text-yellow-400", icon: "👑", price: 200, rarity: "Legendary" },
        { id: "emote-skull", name: "💀 Skull", color: "text-gray-600", icon: "💀", price: 90, rarity: "Rare" },
        { id: "emote-dragon", name: "🐉 Dragon", color: "text-green-400", icon: "🐉", price: 250, rarity: "Platinum" },
        { id: "emote-clown", name: "🤡 Clown", color: "text-pink-500", icon: "🤡", price: 70, rarity: "Bronze" },
        { id: "emote-star", name: "⭐ Star", color: "text-yellow-300", icon: "⭐", price: 110, rarity: "Gold" },
      ],
    },
    {
      category: "🎵 Notification Sounds",
      icon: "🔔",
      type: "sound",
      items: [
        { id: "sound-ding", name: "Ding Sound", color: "text-info", icon: "🎶", price: 80, rarity: "Silver" },
        { id: "sound-laser", name: "Laser Ping", color: "text-cyan-400", icon: "🔊", price: 120, rarity: "Epic" },
        { id: "sound-bell", name: "Bell Ring", color: "text-yellow-400", icon: "🔔", price: 100, rarity: "Rare" },
        { id: "sound-glitch", name: "Glitch Alert", color: "text-purple-400", icon: "⚡", price: 150, rarity: "Legendary" },
        { id: "sound-deep", name: "Deep Bass", color: "text-gray-400", icon: "🎧", price: 130, rarity: "Gold" },
        { id: "sound-zap", name: "Zap FX", color: "text-red-400", icon: "⚡", price: 140, rarity: "Platinum" },
      ],
    },
    {
      category: "🎭 Profile Borders",
      icon: "📏",
      type: "border",
      items: [
        { id: "border-light", name: "Light Edge", color: "border-white", icon: "💡", price: 100, rarity: "Rare" },
        { id: "border-fire", name: "Fire Edge", color: "border-red-600", icon: "🔥", price: 140, rarity: "Epic" },
        { id: "border-frost", name: "Frost Edge", color: "border-cyan-300", icon: "❄️", price: 130, rarity: "Gold" },
        { id: "border-dark", name: "Dark Frame", color: "border-black", icon: "🌑", price: 160, rarity: "Legendary" },
        { id: "border-rainbow", name: "Rainbow Border", color: "border-gradient", icon: "🌈", price: 180, rarity: "Platinum" },
        { id: "border-mystic", name: "Mystic Frame", color: "border-purple-500", icon: "🔮", price: 150, rarity: "Epic" },
      ],
    },
    {
      category: "💬 Chat Bubbles",
      icon: "💬",
      type: "chatBubble",
      items: [
        { id: "bubble-shadow", name: "Shadow Bubble", color: "bg-black text-white", icon: "🗯", price: 100, rarity: "Rare" },
        { id: "bubble-light", name: "Light Bubble", color: "bg-white text-black", icon: "💡", price: 100, rarity: "Silver" },
        { id: "bubble-glow", name: "Glow Bubble", color: "bg-cyan-500 text-white", icon: "✨", price: 130, rarity: "Epic" },
        { id: "bubble-rainbow", name: "Rainbow Bubble", color: "bg-gradient-to-r from-pink-500 to-purple-500 text-white", icon: "🌈", price: 180, rarity: "Platinum" },
        { id: "bubble-metal", name: "Metallic Bubble", color: "bg-gray-500 text-white", icon: "⚙️", price: 150, rarity: "Legendary" },
        { id: "bubble-wood", name: "Wood Bubble", color: "bg-yellow-800 text-white", icon: "🪵", price: 110, rarity: "Bronze" },
      ],
    },
    {
      category: "👑 Role Icons",
      icon: "👤",
      type: "roleIcon",
      items: [
        { id: "role-admin", name: "Admin Crown", color: "text-yellow-400", icon: "👑", price: 200, rarity: "Gold" },
        { id: "role-mod", name: "Mod Shield", color: "text-blue-400", icon: "🛡", price: 160, rarity: "Silver" },
        { id: "role-owner", name: "Owner Mark", color: "text-red-400", icon: "🎯", price: 250, rarity: "Legendary" },
        { id: "role-dev", name: "Dev Badge", color: "text-purple-400", icon: "💻", price: 170, rarity: "Epic" },
        { id: "role-fan", name: "Fan Badge", color: "text-pink-400", icon: "❤️", price: 90, rarity: "Bronze" },
        { id: "role-vip", name: "VIP Icon", color: "text-white", icon: "💎", price: 300, rarity: "Platinum" },
      ],
    },
    {
      category: "📱 UI Themes",
      icon: "🎨",
      type: "theme",
      items: [
        { id: "theme-dark", name: "Dark Theme", color: "bg-black", icon: "🌑", price: 100, rarity: "Silver" },
        { id: "theme-light", name: "Light Theme", color: "bg-white", icon: "🌕", price: 100, rarity: "Rare" },
        { id: "theme-neon", name: "Neon Theme", color: "bg-cyan-500", icon: "💡", price: 150, rarity: "Epic" },
        { id: "theme-hacker", name: "Hacker Style", color: "bg-green-900", icon: "🧠", price: 180, rarity: "Legendary" },
        { id: "theme-future", name: "Future Glow", color: "bg-gradient-to-r from-indigo-500 to-purple-500", icon: "🚀", price: 200, rarity: "Platinum" },
        { id: "theme-nature", name: "Nature Theme", color: "bg-green-500", icon: "🍃", price: 120, rarity: "Gold" },
      ],
    },
  ];


  return (
    <div className="overflow-y-auto h-screen w-full bg-gradient-to-br from-[#0f0f1f] via-[#131325] to-[#1a1a2e] text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 drop-shadow-lg text-accent">
        🛍️ Customization Shop
      </h1>

      {shopChests.map((chest) => (
        <div key={chest.type} className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-cyan-300 tracking-wide flex items-center gap-2">
            <span>{chest.icon}</span> {chest.category}
          </h2>

          {/* Swiper karusel */}
          <Swiper
            spaceBetween={16}
            slidesPerView={3.6}
            breakpoints={{
              640: { slidesPerView: 2.3 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {chest.items.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative group rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-cyan-600/20 shadow-md p-4 hover:scale-[1.03] transition-all duration-300">
                  {/* Background glow */}
                  <div className="absolute inset-0 z-0 rounded-xl blur-xl opacity-20 group-hover:opacity-40 pointer-events-none bg-gradient-to-br from-cyan-500/30 to-transparent"></div>

                  {/* Icon */}
                  <div className="text-4xl mb-2 text-center z-10 relative drop-shadow-md">
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-center ${item.color} z-10 relative`}>
                    {item.name}
                  </h3>

                  {/* Price */}
                  <p className="text-center text-sm text-cyan-200 mt-1 z-10 relative">
                    💰 <span className="text-yellow-300 font-bold">{item.price} coins</span>
                  </p>

                  {/* Rarity */}
                  <div className="text-center mt-2 z-10 relative">
                    <span className="badge badge-outline badge-info uppercase text-[10px] px-3 tracking-widest">
                      {chest.type === "avatarFrame"
                        ? "Legendary"
                        : chest.type === "nameShadow"
                          ? "Epic"
                          : "Rare"}
                    </span>
                  </div>

                  {/* Buy button */}
                  <div className="mt-4 z-10 relative">
                    <button
                      onClick={() => handleBuy(item)}
                      className="btn btn-xs btn-accent w-full"
                    >
                      Sotib olish
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
}
