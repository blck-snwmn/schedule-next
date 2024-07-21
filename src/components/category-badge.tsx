import { Badge } from "./ui/badge";

const getCategoryColor = (category: string): string => {
	switch (category.toLowerCase()) {
		case "音楽":
			return "bg-blue-500";
		case "ライブ":
			return "bg-green-500";
		case "メディア":
			return "bg-purple-500";
		case "出版":
			return "bg-yellow-500";
		case "ファンイベント":
			return "bg-pink-500";
		case "コラボレーション":
			return "bg-indigo-500";
		default:
			return "bg-gray-500";
	}
};

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
	const colorClass = `${getCategoryColor(category)}`;
	return <Badge className={`${colorClass}`}>{category}</Badge>;
};
