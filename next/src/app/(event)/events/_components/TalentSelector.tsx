import type { Talent } from "@/services/type";

export const TalentSelector: React.FC<{
	talents: Talent[];
	selectedTalent: Talent | null;
	onSelect: (talent: Talent | null) => void;
}> = ({ talents, selectedTalent, onSelect }) => {
	return (
		<div className="flex flex-wrap mb-4 gap-2">
			<button
				type="button"
				className={`px-4 py-2 rounded transition-colors duration-200 ${
					!selectedTalent
						? "bg-blue-600 text-white"
						: "bg-gray-700 text-gray-200 hover:bg-gray-600"
				}`}
				onClick={() => onSelect(null)}
			>
				All
			</button>
			{talents.map((talent) => (
				<button
					type="button"
					key={talent.id}
					className={`px-4 py-2 rounded transition-colors duration-200 ${
						selectedTalent?.id === talent.id
							? "bg-blue-600 text-white"
							: "bg-gray-700 text-gray-200 hover:bg-gray-600"
					}`}
					onClick={() => onSelect(talent)}
				>
					{talent.name}
				</button>
			))}
		</div>
	);
};
