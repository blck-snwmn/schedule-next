"use client"

import React, { useState } from 'react';

type Status = 'active' | 'upcoming' | 'past';

interface Schedule {
    id: number;
    name: string;
    start_at: string; // ISO 8601 形式の日時文字列
    end_at: string;   // ISO 8601 形式の日時文字列
    status: Status;
}

interface Event {
    id: number;
    name: string;
    category: string;
    description?: string;
    link?: string;
    schedules: Schedule[];
}

interface Talent {
    id: number;
    name: string;
    events: Event[];
}

const talentA: Talent = {
    id: 1,
    name: "タレントA",
    events: [
        {
            id: 101,
            name: "新曲「星空のメロディ」発売",
            category: "音楽",
            description: "待望のニューシングルがついに発売！",
            link: "https://example.com/new-song-starry-melody",
            schedules: [
                { id: 1001, name: "予約開始", start_at: "2024-06-01T00:00:00Z", end_at: "2024-06-30T23:59:59Z", status: "upcoming" },
                { id: 1002, name: "発売日", start_at: "2024-07-01T00:00:00Z", end_at: "2024-07-01T23:59:59Z", status: "upcoming" }
            ]
        },
        {
            id: 102,
            name: "全国ツアー2024「STARLIGHT」",
            category: "ライブ",
            description: "全国10都市を巡るライブツアー",
            schedules: [
                { id: 1003, name: "東京公演", start_at: "2024-09-15T18:00:00Z", end_at: "2024-09-15T21:00:00Z", status: "upcoming" },
                { id: 1004, name: "大阪公演", start_at: "2024-09-22T18:00:00Z", end_at: "2024-09-22T21:00:00Z", status: "upcoming" }
            ]
        },
        {
            id: 103,
            name: "ファースト写真集「BLOOM」発売",
            category: "出版",
            description: "デビュー5周年を記念した初の写真集",
            link: "https://example.com/photobook-bloom",
            schedules: [
                { id: 1005, name: "予約受付", start_at: "2024-07-15T00:00:00Z", end_at: "2024-08-14T23:59:59Z", status: "upcoming" },
                { id: 1006, name: "発売日", start_at: "2024-08-15T00:00:00Z", end_at: "2024-08-15T23:59:59Z", status: "upcoming" }
            ]
        },
        {
            id: 104,
            name: "トーク番組「スターナイト」出演",
            category: "メディア",
            description: "人気トーク番組にゲスト出演",
            schedules: [
                { id: 1007, name: "放送日", start_at: "2024-08-05T21:00:00Z", end_at: "2024-08-05T22:00:00Z", status: "upcoming" }
            ]
        },
        {
            id: 105,
            name: "サマーフェスティバル2024出演",
            category: "ライブ",
            description: "国内最大級の音楽フェスに出演決定",
            schedules: [
                { id: 1008, name: "出演日", start_at: "2024-08-12T15:00:00Z", end_at: "2024-08-12T16:30:00Z", status: "upcoming" }
            ]
        },
        {
            id: 106,
            name: "ファンクラブイベント「A's PARTY」",
            category: "ファンイベント",
            description: "ファンクラブ会員限定の特別イベント",
            schedules: [
                { id: 1009, name: "申込期間", start_at: "2024-09-01T00:00:00Z", end_at: "2024-09-15T23:59:59Z", status: "upcoming" },
                { id: 1010, name: "イベント日", start_at: "2024-10-10T13:00:00Z", end_at: "2024-10-10T17:00:00Z", status: "upcoming" }
            ]
        },
        {
            id: 107,
            name: "雑誌「GLOW」表紙モデル",
            category: "メディア",
            description: "人気ファッション誌の表紙を飾ります",
            schedules: [
                { id: 1011, name: "発売日", start_at: "2024-09-25T00:00:00Z", end_at: "2024-09-25T23:59:59Z", status: "upcoming" }
            ]
        },
        {
            id: 108,
            name: "コラボレーションカフェOPEN",
            category: "コラボレーション",
            description: "期間限定のテーマカフェがオープン",
            link: "https://example.com/collab-cafe",
            schedules: [
                { id: 1012, name: "開催期間", start_at: "2024-11-01T00:00:00Z", end_at: "2024-12-31T23:59:59Z", status: "upcoming" }
            ]
        },
        {
            id: 109,
            name: "クリスマスシングル「White Love」発売",
            category: "音楽",
            description: "心温まるクリスマスソング",
            link: "https://example.com/christmas-single",
            schedules: [
                { id: 1013, name: "予約開始", start_at: "2024-11-15T00:00:00Z", end_at: "2024-12-14T23:59:59Z", status: "upcoming" },
                { id: 1014, name: "発売日", start_at: "2024-12-15T00:00:00Z", end_at: "2024-12-15T23:59:59Z", status: "upcoming" }
            ]
        },
        {
            id: 110,
            name: "年末特番「MUSIC GALA」出演",
            category: "メディア",
            description: "年末恒例の音楽特別番組に出演",
            schedules: [
                { id: 1015, name: "放送日", start_at: "2024-12-31T20:00:00Z", end_at: "2025-01-01T00:00:00Z", status: "upcoming" }
            ]
        },
        {
            id: 111,
            name: "チャリティーコンサート「HOPE」",
            category: "ライブ",
            description: "災害復興支援のためのチャリティーコンサート",
            schedules: [
                { id: 1016, name: "開催日", start_at: "2025-02-11T18:00:00Z", end_at: "2025-02-11T21:00:00Z", status: "upcoming" }
            ]
        }
    ]
};

// データ例
const sampleData: Talent[] = [
    talentA,
    {
        id: 2,
        name: "タレントB",
        events: []
    },
    {
        id: 3,
        name: "タレントC",
        events: []
    },
]

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const isEventPast = (event: Event): boolean => {
    return event.schedules.every(schedule => schedule.status === 'past');
};

const ScheduleInfo: React.FC<{ schedule: Schedule }> = ({ schedule }) => (
    <div className={`mb-2 p-2 rounded text-sm ${schedule.status === 'past' ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white'}`}>
        <p className="font-semibold">{schedule.name}</p>
        <p className="text-xs">
            {formatDate(schedule.start_at)} - {formatDate(schedule.end_at)}
        </p>
        <p className="text-xs mt-1 capitalize">{schedule.status}</p>
    </div>
);

const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
        case '商品':
            return 'blue';
        case 'ライブ':
            return 'green';
        case 'メディア':
            return 'purple';
        case 'イベント':
            return 'yellow';
        default:
            return 'gray';
    }
};

const CategoryStripe: React.FC<{ category: string }> = ({ category }) => {
    const colorClass = `bg-${getCategoryColor(category)}-500`;
    return <div className={`w-2 h-full absolute left-0 top-0 ${colorClass}`} />;
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    const colorClass = `bg-${getCategoryColor(category)}-500`;
    return (
        <span className={`${colorClass} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
            {category}
        </span>
    );
};

const EventInfo: React.FC<{ event: Event }> = ({ event }) => {
    const isPast = isEventPast(event);
    return (
        <div className={`mb-4 p-4 pl-6 border border-gray-700 rounded relative overflow-hidden ${isPast ? 'bg-gray-800 text-gray-400' : 'bg-gray-800 text-white'}`}>
            <CategoryStripe category={event.category} />
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 pr-4">
                    <div className="mb-1">
                        <CategoryBadge category={event.category} />
                    </div>
                    <div className="flex items-center mb-2">
                        <h3 className="font-bold text-lg ml-2">{event.name}</h3>
                    </div>
                    {event.description && <p className="text-sm mb-2">{event.description}</p>}
                    {event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm mb-2 block">
                            関連リンク
                        </a>
                    )}
                </div>
                <div className="w-full md:w-1/2 mt-3 md:mt-0">
                    {event.schedules.map(schedule => (
                        <ScheduleInfo key={schedule.id} schedule={schedule} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TalentInfoSection: React.FC<{ talent: Talent | null }> = ({ talent }) => {
    if (!talent) return <div className="text-gray-300">タレント情報が見つかりません</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">{talent.name}のイベント情報</h2>
            {talent.events.map(event => (
                <EventInfo key={event.id} event={event} />
            ))}
        </div>
    );
};

const TalentSelector: React.FC<{ talents: Talent[] }> = ({ talents }) => {
    const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

    return (
        <div>
            <div className="flex flex-wrap mb-4 gap-2">
                {talents.map((talent) => (
                    <button
                        key={talent.id}
                        className={`px-4 py-2 rounded transition-colors duration-200 ${selectedTalent?.id === talent.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            }`}
                        onClick={() => setSelectedTalent(talent)}
                    >
                        {talent.name}
                    </button>
                ))}
            </div>
            {selectedTalent && <TalentInfoSection talent={selectedTalent} />}
        </div>
    );
};

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-900 text-white p-4">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6">タレント情報ダッシュボード</h1>
                <TalentSelector talents={sampleData} />
            </div>
        </main>
    );
}
