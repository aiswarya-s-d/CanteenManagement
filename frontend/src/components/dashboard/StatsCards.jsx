import {
  ShoppingCart,
  KeyRound,
  IndianRupee,
} from "lucide-react";

function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-4 px-8 py-4">

      {/* Orders */}
      <div className="bg-[#EEF4FF] rounded-2xl px-5 py-4 flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            Today's Total Orders
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            15
          </h2>
        </div>

        <ShoppingCart
          size={24}
          className="text-blue-600"
        />

      </div>

      {/* OTP */}
      <div className="bg-[#FFF4E8] rounded-2xl px-5 py-4 flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            Recent Pickup OTP
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            73332
          </h2>
        </div>

        <KeyRound
          size={24}
          className="text-orange-500"
        />

      </div>

      {/* Money */}
      <div className="bg-[#ECFDF3] rounded-2xl px-5 py-4 flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            Money Spent Today
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            ₹180
          </h2>
        </div>

        <IndianRupee
          size={24}
          className="text-green-600"
        />

      </div>

    </div>
  );
}

export default StatsCards;