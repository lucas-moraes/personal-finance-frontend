import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X } from "lucide-react";
import type React from "react";

export const TableRowButtonOptions: React.FC<{
  onClose: () => void;
  onEditItem: () => void;
  onDeleteItem: () => void;
}> = ({ onClose, onEditItem, onDeleteItem }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="ghost" className="p-0 m-0 text-white cursor-pointer" onClick={onClose}>
        <X size={16} />
      </Button>
      <Button
        variant="outline"
        className="p-0 m-0 text-amber-500 cursor-pointer hover:bg-amber-500/10"
        onClick={onEditItem}
      >
        <Pencil size={16} />
      </Button>
      <Button
        variant="outline"
        className="p-0 m-0 cursor-pointer text-red-500 hover:bg-red-500/10"
        onClick={onDeleteItem}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};
