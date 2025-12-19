import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';

export const TopicCard: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [topic, setTopic] = useState("如何吃粮食");
  const [subTitle, setSubTitle] = useState("// 欢迎观看神仙打架 //");

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 perspective-1000">
      {/* Decorative black tab */}
      <div className="absolute -top-5 left-8 bg-black text-white px-6 py-1.5 rounded-t-lg z-10 flex items-center gap-2 shadow-lg">
        <span className="text-sm font-bold tracking-widest">• 首期辩题 •</span>
      </div>

      {/* Main White Card */}
      <div className="bg-white rounded-xl shadow-[0_10px_0_0_rgba(0,0,0,1)] border-2 border-black p-8 pt-10 text-center relative overflow-hidden group">
        
        {/* Edit Button (Visible on hover) */}
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
        </button>

        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-center text-4xl font-black text-gray-900 border-b-2 border-blue-200 focus:border-blue-600 outline-none pb-2"
              placeholder="输入辩题..."
            />
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="w-full text-center text-lg text-gray-500 border-b-2 border-gray-100 focus:border-gray-400 outline-none pb-1"
              placeholder="输入副标题..."
            />
          </div>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {topic}
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 mb-4"></div>
            <p className="text-lg text-gray-500 font-medium tracking-wide">
              {subTitle}
            </p>
          </>
        )}
        
        {/* Decorative corner element */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-50 rounded-tl-full -mr-8 -mb-8 z-0"></div>
      </div>
    </div>
  );
};