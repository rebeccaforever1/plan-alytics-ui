import type { Metadata } from “next”;
import { DM_Sans } from “next/font/google”;
import “./globals.css”;

const dmSans = DM_Sans({
variable: “–font-dm-sans”,
subsets: [“latin”],
weight: [“300”, “400”, “500”],
display: “swap”,
});

export const metadata: Metadata = {
title: ‘Sticksy — Member Intelligence’,
description: ‘Know who stays, who leaves, and what to do about it. Member intelligence for businesses that run on loyalty.’,
icons: {
icon: [
{ url: ‘/favicon/favicon-96x96.png’, sizes: ‘96x96’, type: ‘image/png’ },
{ url: ‘/favicon/favicon.svg’, type: ‘image/svg+xml’ },
],
shortcut: ‘/favicon/favicon.ico’,
apple: ‘/favicon/apple-touch-icon.png’,
},
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
<html lang="en">
<head>
<link rel="icon" href="/favicon.ico" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link
href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
rel="stylesheet"
/>
</head>
<body className={dmSans.variable} style={{ margin: 0, padding: 0 }}>
{children}
</body>
</html>
)
}