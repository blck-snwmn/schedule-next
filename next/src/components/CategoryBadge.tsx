import { Badge } from "./ui/badge";

type Category =
	| "音楽"
	| "ライブ"
	| "メディア"
	| "出版"
	| "ファンイベント"
	| "コラボレーション";

const categoryColors: Record<Category, string> = {
	音楽: "bg-blue-500",
	ライブ: "bg-green-500",
	メディア: "bg-purple-500",
	出版: "bg-yellow-500",
	ファンイベント: "bg-pink-500",
	コラボレーション: "bg-indigo-500",
};

const categories: Category[] = Object.keys(categoryColors) as Category[];

const getCategoryColor = (category: string): string => {
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
