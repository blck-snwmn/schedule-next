import { type Category, categoryColors } from "@/services/type";
import { Badge } from "./ui/badge";

export const getCategoryColor = (category: string): string => {
	if (isCategory(category)) {
		return categoryColors[category];
	}
	return "bg-gray-500"; // デフォルト
};

function isCategory(value: string): value is Category {
	return value in categoryColors;
}

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
	const colorClass = `${getCategoryColor(category)}`;
	return <Badge className={`${colorClass}`}>{category}</Badge>;
};
