import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const FlowerItem = ({ flower, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex h-24 overflow-hidden">
      {/* Image section - Left */}
      <div className="w-24 h-24 relative shrink-0">
        {flower.imageUrl ? (
          <Image
            src={flower.imageUrl}
            alt={flower.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badge indicator */}
        {(flower.isBestSeller || flower.isNewArrival || flower.isPromotion) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 px-1">
            <span className="text-white text-xs font-medium truncate block text-center">
              {flower.isNewArrival
                ? "New"
                : flower.isBestSeller
                ? "Best Seller"
                : "Promo"}
            </span>
          </div>
        )}
      </div>

      {/* Info section - Middle */}
      <div className="flex-1 p-2 flex flex-col justify-center overflow-hidden">
        <div className="flex justify-between items-center">
          <h3
            className="font-medium text-gray-800 truncate text-sm sm:text-base"
            title={flower.name}
          >
            {flower.name}
          </h3>
          <span className="text-green-600 font-semibold text-sm whitespace-nowrap">
            ฿{flower.price}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
            THC {flower.thc}%
          </span>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            S: {flower.sativa}% | I: {flower.indica}%
          </span>
        </div>

        <div className="flex items-center mt-1 gap-3 text-xs">
          <TagList
            title="Effects"
            items={flower.effects}
            bgColor="bg-blue-50"
            textColor="text-blue-700"
            displayCount={2}
          />
          <TagList
            title="Flavors"
            items={flower.flavors}
            bgColor="bg-purple-50"
            textColor="text-purple-700"
            displayCount={1}
          />
        </div>
      </div>

      {/* Actions section - Right */}
      <div className="flex flex-col justify-center items-center gap-2 px-2 border-l border-gray-200 w-20 shrink-0">
        <button
          onClick={() => onEdit(flower)}
          className="w-full h-8 px-2 bg-blue-50 text-blue-700 text-xs font-medium rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
          title="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(flower.id)}
          className="w-full h-8 px-2 bg-red-50 text-red-700 text-xs font-medium rounded hover:bg-red-100 transition-colors flex items-center justify-center"
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

// Helper component for repeated tag lists
const TagList = ({
  title,
  items = [],
  bgColor,
  textColor,
  displayCount = 2,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-center overflow-hidden">
      <span className="text-gray-500 mr-1 shrink-0">{title}:</span>
      <div className="flex gap-1 overflow-hidden">
        {items.slice(0, displayCount).map((item, idx) => (
          <span
            key={idx}
            className={`px-1.5 py-0.5 ${bgColor} ${textColor} rounded-full truncate max-w-[80px]`}
          >
            {item}
          </span>
        ))}
        {items.length > displayCount && (
          <span className="text-gray-500">+{items.length - displayCount}</span>
        )}
      </div>
    </div>
  );
};

export default FlowerItem;
