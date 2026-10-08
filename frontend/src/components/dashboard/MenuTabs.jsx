function MenuTabs() {
  return (
    <div className="px-8 mt-2">

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Today's Menu
      </h2>

      <div className="flex gap-3">

        <button
          className="
          bg-slate-900
          text-white
          px-5
          py-2
          rounded-full
          text-sm
          font-medium
          "
        >
          Breakfast
        </button>

        <button
          className="
          bg-white
          border
          border-gray-200
          px-5
          py-2
          rounded-full
          text-sm
          font-medium
          "
        >
          Lunch
        </button>

        <button
          className="
          bg-white
          border
          border-gray-200
          px-5
          py-2
          rounded-full
          text-sm
          font-medium
          "
        >
          Snacks
        </button>

        <button
          className="
          bg-white
          border
          border-gray-200
          px-5
          py-2
          rounded-full
          text-sm
          font-medium
          "
        >
          Beverages
        </button>

      </div>

    </div>
  );
}

export default MenuTabs;