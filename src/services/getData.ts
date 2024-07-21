const talentAEvent: ScheduleEvent[] = [
    {
        id: 101,
        name: "新曲「星空のメロディ」発売",
        category: "音楽",
        description: "待望のニューシングルがついに発売！",
        schedules: [
            { id: 1001, name: "予約開始", start_at: "2024-06-01T00:00:00Z", end_at: "2024-06-30T23:59:59Z", status: "upcoming" },
            { id: 1002, name: "発売日", start_at: "2024-07-01T00:00:00Z", end_at: "2024-07-01T23:59:59Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }, { id: 2, name: "タレントB" }]

    },
    {
        id: 102,
        name: "全国ツアー2024「STARLIGHT」",
        category: "ライブ",
        description: "全国10都市を巡るライブツアー",
        schedules: [
            { id: 1003, name: "東京公演", start_at: "2024-09-15T18:00:00Z", end_at: "2024-09-15T21:00:00Z", status: "upcoming" },
            { id: 1004, name: "大阪公演", start_at: "2024-09-22T18:00:00Z", end_at: "2024-09-22T21:00:00Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }, { id: 2, name: "タレントB" }]
    },
    {
        id: 103,
        name: "ファースト写真集「BLOOM」発売",
        category: "出版",
        description: "デビュー5周年を記念した初の写真集",
        schedules: [
            { id: 1005, name: "予約受付", start_at: "2024-07-15T00:00:00Z", end_at: "2024-08-14T23:59:59Z", status: "upcoming" },
            { id: 1006, name: "発売日", start_at: "2024-08-15T00:00:00Z", end_at: "2024-08-15T23:59:59Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }, { id: 3, name: "タレントC" }]
    },
    {
        id: 104,
        name: "トーク番組「スターナイト」出演",
        category: "メディア",
        description: "人気トーク番組にゲスト出演",
        schedules: [
            { id: 1007, name: "放送日", start_at: "2024-08-05T21:00:00Z", end_at: "2024-08-05T22:00:00Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }]
    },
    {
        id: 105,
        name: "サマーフェスティバル2024出演",
        category: "ライブ",
        description: "国内最大級の音楽フェスに出演決定",
        schedules: [
            { id: 1008, name: "出演日", start_at: "2024-08-12T15:00:00Z", end_at: "2024-08-12T16:30:00Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }]
    },
    {
        id: 106,
        name: "ファンクラブイベント「A's PARTY」",
        category: "ファンイベント",
        description: "ファンクラブ会員限定の特別イベント",
        schedules: [
            { id: 1009, name: "申込期間", start_at: "2024-09-01T00:00:00Z", end_at: "2024-09-15T23:59:59Z", status: "upcoming" },
            { id: 1010, name: "イベント日", start_at: "2024-10-10T13:00:00Z", end_at: "2024-10-10T17:00:00Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }]
    },
    {
        id: 107,
        name: "雑誌「GLOW」表紙モデル",
        category: "メディア",
        description: "人気ファッション誌の表紙を飾ります",
        schedules: [
            { id: 1011, name: "発売日", start_at: "2024-09-25T00:00:00Z", end_at: "2024-09-25T23:59:59Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }]
    },
    {
        id: 108,
        name: "コラボレーションカフェOPEN",
        category: "コラボレーション",
        description: "期間限定のテーマカフェがオープン",
        schedules: [
            { id: 1012, name: "開催期間", start_at: "2024-11-01T00:00:00Z", end_at: "2024-12-31T23:59:59Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }]
    },
    {
        id: 109,
        name: "クリスマスシングル「White Love」発売",
        category: "音楽",
        description: "心温まるクリスマスソング",
        schedules: [
            { id: 1013, name: "予約開始", start_at: "2024-11-15T00:00:00Z", end_at: "2024-12-14T23:59:59Z", status: "upcoming" },
            { id: 1014, name: "発売日", start_at: "2024-12-15T00:00:00Z", end_at: "2024-12-15T23:59:59Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }]
    },
    {
        id: 110,
        name: "年末特番「MUSIC GALA」出演",
        category: "メディア",
        description: "年末恒例の音楽特別番組に出演",
        schedules: [
            { id: 1015, name: "放送日", start_at: "2024-12-31T20:00:00Z", end_at: "2025-01-01T00:00:00Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }]
    },
    {
        id: 111,
        name: "チャリティーコンサート「HOPE」",
        category: "ライブ",
        description: "災害復興支援のためのチャリティーコンサート",
        schedules: [
            { id: 1016, name: "開催日", start_at: "2025-02-11T18:00:00Z", end_at: "2025-02-11T21:00:00Z", status: "upcoming" }
        ],
        relatedTalents: [{ id: 1, name: "タレントA" }]
    }
]

const talents = talentAEvent.map(event => event.relatedTalents).flat().reduce((acc, talent) => {
    if (!acc.find(t => t.id === talent.id)) {
        acc.push(talent);
    }
    return acc;
}, [] as Talent[])

export function getEvents() {
    return talentAEvent
}

export async function getTaletns() {
    return talents;
}
