export const runtime = "edge";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "[EXAMPLE]タレント情報ダッシュボード",
		template: "%s | [EXAMPLE]タレント情報ダッシュボード",
	},
	description:
		"タレントのスケジュール、イベント、および関連情報を一元管理するダッシュボード",
	keywords: ["タレント", "スケジュール", "イベント", "エンターテインメント"],
	openGraph: {
		title: "[EXAMPLE]タレント情報ダッシュボード",
		description: "タレントのスケジュール、イベント、および関連情報を一元管理",
		// url: 'https://example.com',
		siteName: "タレント情報ダッシュボード",
		// images: [
		//   {
		//     url: 'https://example.com/og-image.jpg',
		//     width: 1200,
		//     height: 630,
		//   },
		// ],
		locale: "ja_JP",
		type: "website",
	},
	twitter: {
		title: "[EXAMPLE]タレント情報ダッシュボード",
		card: "summary_large_image",
		description: "タレントのスケジュール、イベント、および関連情報を一元管理",
		// images: ['https://example.com/twitter-image.jpg'],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}