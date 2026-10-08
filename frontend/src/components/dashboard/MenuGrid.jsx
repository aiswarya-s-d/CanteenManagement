import FoodCard from "./FoodCard";

function MenuGrid() {

  const foods = [
    {
      id: 1,
      name: "Masala Dosa",
      price: 40,
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500",
    },
    {
      id: 2,
      name: "Idli Sambar",
      price: 30,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500",
    },
    {
      id: 3,
      name: "Pongal",
      price: 35,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500",
    },
    {
      id: 4,
      name: "Poori",
      price: 45,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
    },
  ];

  return (
    <div className="px-8 py-6">

      <div className="grid grid-cols-4 gap-5">

        {foods.map((food) => (
          <FoodCard
            key={food.id}
            image={food.image}
            name={food.name}
            price={food.price}
          />
        ))}

      </div>

    </div>
  );
}

export default MenuGrid;