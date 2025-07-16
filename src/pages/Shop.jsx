import { FaCrown, FaGem, FaUserShield } from "react-icons/fa";

export default function Shop() {
  const items = [
    {
      name: "Premium",
      icon: <FaCrown />,
      price: "10 coins",
      desc: "Получите доступ ко всем функциям",
    },
    {
      name: "100 Gems",
      icon: <FaGem />,
      price: "$2.99",
      desc: "Пополните баланс внутриигровой валюты",
    },
    {
      name: "VIP Badge",
      icon: <FaUserShield />,
      price: "Free",
      desc: "Статус уважаемого игрока в чате",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-secondary mb-6">🛒 Магазин</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="card bg-base-200 shadow-xl transition hover:scale-105"
          >
            <div className="card-body items-center text-center">
              <div className="text-4xl text-warning">{item.icon}</div>
              <h2 className="card-title">{item.name}</h2>
              <p className="text-sm">{item.desc}</p>
              <div className="badge badge-outline my-2">{item.price}</div>
              <div className="card-actions">
                <button className="btn btn-secondary btn-sm">Купить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
