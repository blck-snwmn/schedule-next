"use client"

import React, { useState } from 'react';

// 型定義
interface Talent {
    id: number;
    name: string;
}

interface Product {
    name: string;
    reservationPeriod: string;
    releaseDate: string;
}

interface Live {
    name: string;
    date: string;
    ticketSale: string;
}

interface TalentInfo {
    products: Product[];
    lives: Live[];
}

// データ取得関数
async function getTalents(): Promise<Talent[]> {
    // 実際のアプリケーションではここでデータベースやAPIからデータを取得します
    return [
        { id: 1, name: 'タレントA' },
        { id: 2, name: 'タレントB' },
        { id: 3, name: 'タレントC' },
    ];
}

async function getTalentInfo(id: number): Promise<TalentInfo | null> {
    // 実際のアプリケーションではここでデータベースやAPIからデータを取得します
    const talentInfo: Record<number, TalentInfo> = {
        1: {
            products: [
                { name: '写真集', reservationPeriod: '2024/8/1 - 2024/8/31', releaseDate: '2024/9/15' },
                { name: 'CD', reservationPeriod: '2024/7/15 - 2024/8/15', releaseDate: '2024/9/1' },
            ],
            lives: [
                { name: '東京ライブ', date: '2024/10/1', ticketSale: '2024/8/1 10:00 -' },
                { name: '大阪ライブ', date: '2024/10/15', ticketSale: '2024/8/15 10:00 -' },
            ],
        },
        // 他のタレントの情報も同様に追加
    };

    return talentInfo[id] || null;
}

// コンポーネント
const ProductInfo: React.FC<{ product: Product }> = ({ product }) => (
    <div className="mb-4 p-4 border rounded">
        <h3 className="font-bold">{product.name}</h3>
        <p>予約期間: {product.reservationPeriod}</p>
        <p>発売日: {product.releaseDate}</p>
    </div>
);

const LiveInfo: React.FC<{ live: Live }> = ({ live }) => (
    <div className="mb-4 p-4 border rounded">
        <h3 className="font-bold">{live.name}</h3>
        <p>日時: {live.date}</p>
        <p>チケット販売: {live.ticketSale}</p>
    </div>
);

const TalentInfoSection: React.FC<{ talentInfo: TalentInfo | null }> = ({ talentInfo }) => {
    if (!talentInfo) return <div>タレント情報が見つかりません</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">商品情報</h2>
            {talentInfo.products.map((product, index) => (
                <ProductInfo key={index} product={product} />
            ))}
            <h2 className="text-xl font-semibold mb-2 mt-4">ライブ情報</h2>
            {talentInfo.lives.map((live, index) => (
                <LiveInfo key={index} live={live} />
            ))}
        </div>
    );
};

const TalentSelector: React.FC<{ talents: Talent[] }> = ({ talents }) => {
    const [selectedTalent, setSelectedTalent] = useState<number | null>(null);
    const [talentInfo, setTalentInfo] = useState<TalentInfo | null>(null);

    const handleTalentSelect = async (id: number) => {
        setSelectedTalent(id);
        const info = await getTalentInfo(id);
        setTalentInfo(info);
    };

    return (
        <div>
            <div className="flex mb-4">
                {talents.map((talent) => (
                    <button
                        key={talent.id}
                        className={`mr-2 px-4 py-2 rounded ${selectedTalent === talent.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                        onClick={() => handleTalentSelect(talent.id)}
                    >
                        {talent.name}
                    </button>
                ))}
            </div>
            {selectedTalent && <TalentInfoSection talentInfo={talentInfo} />}
        </div>
    );
};

export default async function Home() {
    const talents = await getTalents();

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">タレント情報ダッシュボード</h1>
            <TalentSelector talents={talents} />
        </main>
    );
}