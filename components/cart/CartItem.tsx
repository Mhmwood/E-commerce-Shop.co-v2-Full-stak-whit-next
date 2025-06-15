import React from "react";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
          {image && (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-blue-600 font-bold">${price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(id, Math.max(0, quantity - 1))}
        >
          <Minus size={16} />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(id, quantity + 1)}
        >
          <Plus size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(id)}
          className="text-red-600 hover:text-red-700"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
