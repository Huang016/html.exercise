const express = require("express");
const axios = require("axios");
const app = express();

app.get("/api/pollution", async (req, res) => {
    try {
        const apiKey = "3e2396a4-442f-40ed-81d8-4f0dfd103f00"; // 從環境部申請
        const url = `https://data.moenv.gov.tw/api/v2/STAT_P_120?format=json&limit=100&api_key=${apiKey}`;
        
        const response = await axios.get(url);
        const data = response.data;

        // 轉換成前端需要的格式
        const formatted = data.map(item => ({
            name: item.SiteName || item.LocationName,
            lat: parseFloat(item.Latitude),
            lng: parseFloat(item.Longitude),
            level: item.DebrisDensity > 100 ? "danger" : 
                   item.DebrisDensity > 50 ? "warning" : "safe"
        }));

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "資料抓取失敗" });
    }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
