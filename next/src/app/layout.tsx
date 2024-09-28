export const runtime = "edge";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Menu } from "@/components/Menu";
import { Separator } from "@/components/ui/separator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "[EXAMPLE]イベント情報ダッシュボード",
		template: "%s | [EXAMPLE]イベント情報ダッシュボード",
	},
	description:
		"タレントのスケジュール、イベント、および関連情報を一元管理するダッシュボード",
	keywords: ["タレント", "スケジュール", "イベント", "エンターテインメント"],
	openGraph: {
		title: "[EXAMPLE]イベント情報ダッシュボード",
		description: "タレントのスケジュール、イベント、および関連情報を一元管理",
		// url: 'https://example.com',
		siteName: "イベント情報ダッシュボード",
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
		title: "[EXAMPLE]イベント情報ダッシュボード",
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
			<body className={`${inter.className} bg-gray-900 text-white`}>
				<Menu />
				<Separator />
				<div className="m-3">{children}</div>
			</body>
		</html>
	);
}
