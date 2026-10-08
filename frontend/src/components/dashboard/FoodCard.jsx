import { Plus } from "lucide-react";

function FoodCard({ image, name, price }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition">

      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">

        <h3 className="font-semibold text-gray-900">
          {name}
        </h3>

        <div className="mt-3 flex items-center justify-between">

          <span className="font-bold text-lg">
            ₹{price}
          </span>

          <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800">
            <Plus size={16} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default FoodCard;