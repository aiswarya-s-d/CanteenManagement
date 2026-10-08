function WelcomeBanner() {
  return (
    <section className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-200">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Good Morning, John! 👋
        </h1>

        <p className="mt-1 text-gray-500">
          Have a great day ahead!
        </p>
      </div>

      <img
        src="/images/man-eating.png"
        alt="Eating Illustration"
        className="h-28 object-contain"
      />

    </section>
  );
}

export default WelcomeBanner;