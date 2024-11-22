import React, { useState } from 'react';
import { 
  Notebook, Edit3, Hash, Clock, Moon, Layout, Search, Menu, X,
  Github, Twitter, Linkedin, Mail, Tag, FolderTree, Brain
} from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Notebook className="h-8 w-8 text-blue-600" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                  <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">About</a>
                  <a href="#blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Blog</a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Open App
                <Edit3 className="ml-2 -mr-1 w-4 h-4" />
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
              <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</a>
              <a href="#blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Blog</a>
              <button
                onClick={onGetStarted}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Open App
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <Notebook className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your thoughts, organized
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            A beautiful and intuitive note-taking app that helps you capture, organize, and share your ideas effortlessly.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
            <Edit3 className="ml-2 -mr-1 w-5 h-5" />
          </button>
        </div>

        {/* App Preview */}
        <div className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-transparent dark:from-gray-900 pointer-events-none" />
          <img
            src="https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?auto=format&fit=crop&q=80&w=1920"
            alt="App Preview"
            className="rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800"
          />
        </div>

        {/* Features Section */}
        <div id="features" className="py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything you need to capture ideas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Layout,
                title: 'Multiple formats',
                description: 'Write in plain text, rich text, markdown, code, or create checklists.',
                image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=600'
              },
              {
                icon: Hash,
                title: 'Smart organization',
                description: 'Tag your notes and organize them into folders for easy access.',
                image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600'
              },
              {
                icon: Search,
                title: 'Powerful search',
                description: 'Find any note instantly with our powerful search functionality.',
                image: 'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?auto=format&fit=crop&q=80&w=600'
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="absolute -top-4 left-6">
                  <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features Section */}
        <div id="ai-features" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                AI-Powered Note Organization
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Let our AI assistant help you organize your notes more effectively with smart suggestions and insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Smart Tagging
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get intelligent tag suggestions based on your note content to help you organize better.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <FolderTree className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Folder Suggestions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive recommendations for organizing your notes into meaningful folder structures.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Content Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get insights and suggestions to improve your note organization and structure.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              About Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We believe in the power of organized thoughts. Our mission is to provide a beautiful and intuitive platform
              that helps people capture and develop their ideas, making note-taking a delightful experience.
            </p>
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1200"
              alt="Team collaboration"
              className="rounded-xl shadow-lg mb-8"
            />
          </div>
        </div>

        {/* Blog Section */}
        <div id="blog" className="py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Latest from our blog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'The Art of Note-Taking',
                excerpt: 'Discover effective techniques for taking better notes and organizing your thoughts.',
                image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Productivity Tips',
                excerpt: 'Learn how to boost your productivity with smart note-taking strategies.',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Digital Organization',
                excerpt: 'Master the art of organizing your digital notes and documents.',
                image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=600'
              }
            ].map((post) => (
              <div key={post.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                  <a
                    href="#"
                    className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center mb-4">
                  <Notebook className="h-8 w-8 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Notes App</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  A beautiful and intuitive note-taking app that helps you capture, organize, and share your ideas effortlessly.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Product
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Connect
                </h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <Github className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <Mail className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-center text-gray-500 dark:text-gray-400">
                © 2024 Notes App. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}