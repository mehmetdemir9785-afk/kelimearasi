// Kelimearası User System & Storage
(function(global) {
    const STORAGE_KEY = 'ka_user_data';

    // Seviye ve XP Hesaplama Fonksiyonu
    // Her 10 seviyede bir, gereken XP 100 artar.
    // Lvl 1-10: 1000 XP
    // Lvl 11-20: 1100 XP
    // Lvl 21-30: 1200 XP vb.
    function calculateLevelData(totalXp) {
        let level = 1;
        let xpLeft = totalXp;
        let currentLevelReq = 1000;

        while (true) {
            currentLevelReq = 1000 + Math.floor((level - 1) / 10) * 100;
            if (xpLeft >= currentLevelReq) {
                xpLeft -= currentLevelReq;
                level++;
            } else {
                break;
            }
        }

        return {
            level: level,
            xpInCurrentLevel: xpLeft,
            xpRequiredForNext: currentLevelReq
        };
    }

    const DEFAULT_DATA = {
        username: "Bulmaca Sever",
        joinDate: new Date().toISOString(),
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        lastPlayDate: null,
        totalTimeSeconds: 0,
        xp: 0,
        level: 1,
        gameStats: {}, 
        playedCategories: [],
                        achievements: {
            // Wins
            first_blood: false, fast_learner: false, unbeatable: false, champion: false,
            wins_500: false, conqueror: false, wins_2500: false, wins_5000: false, wins_10000: false,
            
            // Streaks
            streak_3: false, serial_killer: false, streak_14: false, addict: false,
            streak_60: false, dedication: false, streak_180: false, year_streak: false, streak_500: false,
            
            // Played
            played_10: false, played_50: false, legend: false, true_fan: false,
            played_1000: false, obsessed: false, played_5000: false,
            
            // Levels
            level_5: false, apprentice: false, expert: false, grandmaster: false,
            level_75: false, god_tier: false, level_150: false, level_250: false,
            
            // Time
            time_1: false, time_5: false, time_bender: false, half_day: false,
            time_50: false, full_day: false, time_250: false,
            
            // Age
            join_7: false, veteran: false, century_club: false, half_year: false,
            anniversary: false, join_730: false,
            
            // Variety
            brainstorm: false, explorer_5: false, explorer: false, completionist: false
        }
    };

    const KaUser = {
        getData() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                if (data) {
                    const parsed = JSON.parse(data);
                    return { ...DEFAULT_DATA, ...parsed, achievements: { ...DEFAULT_DATA.achievements, ...(parsed.achievements || {}) } };
                }
            } catch (e) {
                console.error("User data could not be loaded", e);
            }
            return { ...DEFAULT_DATA, achievements: { ...DEFAULT_DATA.achievements } };
        },

        saveData(data) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error("User data could not be saved", e);
            }
        },

        
        updateUsername(newName) {
            if (!newName || newName.trim().length === 0) return;
            const data = this.getData();
            data.username = newName.trim().substring(0, 20); // max 20 chars
            this.saveData(data);
        },

        addGameResult(gameId, category, isWin, timeSeconds) {
            const data = this.getData();
            
            // Temel İstatistikler
            data.gamesPlayed += 1;
            if (isWin) data.gamesWon += 1;
            data.totalTimeSeconds += (timeSeconds || 0);

            // Oyun ve Kategori Takibi
            data.gameStats[gameId] = (data.gameStats[gameId] || 0) + 1;
            if (category && !data.playedCategories.includes(category)) {
                data.playedCategories.push(category);
            }

            // Seri (Streak) Hesaplama
            const todayStr = new Date().toLocaleDateString('tr-TR'); 
            if (data.lastPlayDate) {
                const lastDate = new Date(data.lastPlayDate.split('.').reverse().join('-')); 
                const today = new Date(todayStr.split('.').reverse().join('-'));
                const diffTime = Math.abs(today - lastDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                if (diffDays === 1) {
                    data.currentStreak += 1;
                } else if (diffDays > 1) {
                    data.currentStreak = 1;
                }
            } else {
                data.currentStreak = 1;
            }
            data.lastPlayDate = todayStr;
            if (data.currentStreak > data.maxStreak) {
                data.maxStreak = data.currentStreak;
            }

            // XP ve Level Hesaplama
            const xpGained = isWin ? 50 : 10;
            data.xp += xpGained;
            const levelInfo = calculateLevelData(data.xp);
            data.level = levelInfo.level;

            this.saveData(data);
            
            // Başarımları Kontrol Et
            this.checkAchievements();
        },

        checkAchievements() {
            const data = this.getData();
            let newlyUnlocked = [];

            // Helper to unlock
            const unlock = (key, name) => {
                if (!data.achievements[key]) {
                    data.achievements[key] = true;
                    newlyUnlocked.push(name);
                }
            };

            
            
            // Kazanma başarımları
            if (data.gamesWon >= 1) unlock('first_blood', 'İlk Kan');
            if (data.gamesWon >= 10) unlock('fast_learner', 'Isınma Turu');
            if (data.gamesWon >= 50) unlock('unbeatable', 'Yenilmez');
            if (data.gamesWon >= 250) unlock('champion', 'Şampiyon');
            if (data.gamesWon >= 500) unlock('wins_500', 'Savaşçı');
            if (data.gamesWon >= 1000) unlock('conqueror', 'Fatih');
            if (data.gamesWon >= 2500) unlock('wins_2500', 'Kahraman');
            if (data.gamesWon >= 5000) unlock('wins_5000', 'Yenilmez Ordu');
            if (data.gamesWon >= 10000) unlock('wins_10000', 'Bulmaca Tanrısı');
            
            // Seri başarımları
            if (data.maxStreak >= 3) unlock('streak_3', 'Isınma Serisi');
            if (data.maxStreak >= 5) unlock('serial_killer', 'Seri Katil');
            if (data.maxStreak >= 14) unlock('streak_14', 'İki Hafta');
            if (data.maxStreak >= 30) unlock('addict', 'Bağımlı');
            if (data.maxStreak >= 60) unlock('streak_60', 'İstikrar');
            if (data.maxStreak >= 100) unlock('dedication', 'Adanmışlık');
            if (data.maxStreak >= 180) unlock('streak_180', 'Yarım Yıl Serisi');
            if (data.maxStreak >= 365) unlock('year_streak', 'Demir İrade');
            if (data.maxStreak >= 500) unlock('streak_500', 'Durmak Yok');
            
            // Çözme başarımları
            if (data.gamesPlayed >= 10) unlock('played_10', 'Çaylak');
            if (data.gamesPlayed >= 50) unlock('played_50', 'Hevesli');
            if (data.gamesPlayed >= 100) unlock('legend', 'Efsane');
            if (data.gamesPlayed >= 500) unlock('true_fan', 'Gerçek Hayran');
            if (data.gamesPlayed >= 1000) unlock('played_1000', 'Binler Kulübü');
            if (data.gamesPlayed >= 2500) unlock('obsessed', 'Takıntılı');
            if (data.gamesPlayed >= 5000) unlock('played_5000', 'Makinist');
            
            // Seviye başarımları
            if (data.level >= 5) unlock('level_5', 'İlk Adım');
            if (data.level >= 10) unlock('apprentice', 'Çırak');
            if (data.level >= 25) unlock('expert', 'Uzman');
            if (data.level >= 50) unlock('grandmaster', 'Büyük Usta');
            if (data.level >= 75) unlock('level_75', 'Bilge');
            if (data.level >= 100) unlock('god_tier', 'İlah');
            if (data.level >= 150) unlock('level_150', 'Üstat');
            if (data.level >= 250) unlock('level_250', 'Mistik');
            
            // Zaman başarımları
            if (data.totalTimeSeconds >= 3600) unlock('time_1', '1 Saatlik Mola');
            if (data.totalTimeSeconds >= 18000) unlock('time_5', '5 Saatlik Mesai');
            if (data.totalTimeSeconds >= 36000) unlock('time_bender', 'Zaman Bükücü'); // 10 saat
            if (data.totalTimeSeconds >= 86400) unlock('half_day', 'Zaman Yolcusu'); // 24 saat
            if (data.totalTimeSeconds >= 180000) unlock('time_50', '50 Saat'); 
            if (data.totalTimeSeconds >= 360000) unlock('full_day', 'Uykusuz'); // 100 saat
            if (data.totalTimeSeconds >= 900000) unlock('time_250', '250 Saat');
            
            // Üyelik yaşı başarımları
            const joinDate = new Date(data.joinDate);
            const now = new Date();
            const daysSinceJoin = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
            
            if (daysSinceJoin >= 7) unlock('join_7', 'İlk Hafta');
            if (daysSinceJoin >= 30) unlock('veteran', 'Kıdemli');
            if (daysSinceJoin >= 100) unlock('century_club', 'Yüzler Kulübü');
            if (daysSinceJoin >= 180) unlock('half_year', 'Sadık Dost');
            if (daysSinceJoin >= 365) unlock('anniversary', 'Yıl Dönümü');
            if (daysSinceJoin >= 730) unlock('join_730', 'İkinci Yıl');
            
            // Çeşitlilik başarımları
            if (data.playedCategories.length >= 3) unlock('brainstorm', 'Beyin Fırtınası');
            if (Object.keys(data.gameStats).length >= 5) unlock('explorer_5', 'Gezgin');
            if (Object.keys(data.gameStats).length >= 10) unlock('explorer', 'Kaşif');
            if (Object.keys(data.gameStats).length >= 16) unlock('completionist', 'Koleksiyoncu');
if (newlyUnlocked.length > 0) {
                this.saveData(data);
                console.log("Yeni Başarımlar Açıldı:", newlyUnlocked);
            }
        },

        getFormattedStats() {
            const data = this.getData();
            
            let favoriteGame = "-";
            let maxPlays = 0;
            for (const [game, plays] of Object.entries(data.gameStats)) {
                if (plays > maxPlays) {
                    maxPlays = plays;
                    favoriteGame = game; 
                }
            }

            const hours = Math.floor(data.totalTimeSeconds / 3600);
            const minutes = Math.floor((data.totalTimeSeconds % 3600) / 60);
            let timeStr = "";
            if (hours > 0) timeStr += `${hours}s `;
            timeStr += `${minutes}dk`;
            if (hours === 0 && minutes === 0) timeStr = "1dk'dan az";

            const joinD = new Date(data.joinDate);
            const joinStr = joinD.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

            const winRate = data.gamesPlayed > 0 ? Math.round((data.gamesWon / data.gamesPlayed) * 100) : 0;
            const unlockedCount = Object.values(data.achievements).filter(v => v).length;
            
            const levelInfo = calculateLevelData(data.xp);

            return {
                ...data,
                formattedJoinDate: joinStr,
                winRate: winRate,
                favoriteGameId: favoriteGame,
                formattedTime: timeStr,
                unlockedAchievementsCount: unlockedCount,
                totalAchievements: Object.keys(data.achievements).length,
                xpInCurrentLevel: levelInfo.xpInCurrentLevel,
                xpRequiredForNext: levelInfo.xpRequiredForNext
            };
        }
    };

    global.KaUser = KaUser;

})(window);
