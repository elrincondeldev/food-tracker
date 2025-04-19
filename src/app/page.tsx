import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Food Tracker</h1>
        <p className="text-xl text-gray-600 mb-8">
          Track your nutrition, set goals, and achieve a healthier lifestyle
        </p>
        <Link 
          href="/register" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Get Started
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Track Your Nutrition</h2>
          <p className="text-gray-600">
            Monitor your daily caloric intake and macronutrient distribution to stay on track with your goals.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">🎯</div>
          <h2 className="text-xl font-semibold mb-2">Set Personalized Goals</h2>
          <p className="text-gray-600">
            Create customized nutrition plans based on your age, weight, height, activity level, and goals.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">📈</div>
          <h2 className="text-xl font-semibold mb-2">Monitor Progress</h2>
          <p className="text-gray-600">
            Track your progress over time and adjust your plan as needed to achieve optimal results.
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
        <ol className="space-y-4 max-w-2xl mx-auto">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">1</span>
            <div>
              <h3 className="font-semibold">Register Your Information</h3>
              <p className="text-gray-600">Enter your personal details including age, gender, weight, height, activity level, and goals.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">2</span>
            <div>
              <h3 className="font-semibold">Get Your Personalized Plan</h3>
              <p className="text-gray-600">Our AI-powered system calculates your daily caloric needs and macronutrient distribution.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">3</span>
            <div>
              <h3 className="font-semibold">Track Your Progress</h3>
              <p className="text-gray-600">Monitor your nutrition and adjust your plan as needed to achieve your health goals.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
