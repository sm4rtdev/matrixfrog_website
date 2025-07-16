export interface EpisodeConfig {
    id: string;
    title: string;
    status: 'completed' | 'active' | 'upcoming';
    votingStartDate?: Date;
    votingEndDate?: Date;
    winner?: 'red' | 'green';
    redVotes?: number;
    greenVotes?: number;
    totalVotes?: number;
    redWalletAddress: string;
    greenWalletAddress: string;
    description: string;
    redPathDescription: string;
    greenPathDescription: string;
    videoUrl?: string;
    cachedRedVotes?: number;
    cachedGreenVotes?: number;
    cachedTotalVotes?: number;
    cacheTimestamp?: Date;
}

// Episode Configuration - Easy to update for new episodes
export const EPISODE_CONFIGS: EpisodeConfig[] = [
    {
        id: "episode-1",
        title: "Episode 1: Flying Dreams",
        status: "completed", //completed, active, upcoming
        votingStartDate: new Date("2025-07-09"),
        votingEndDate: new Date("2025-07-16"),
        winner: "green", //red, green
        redWalletAddress: "0x811e9Bceeab4D26Af545E1039dc37a32100570d3",
        greenWalletAddress: "0x81D1851281d12733DCF175A3476FD1f1B245aE53",
        description: "Prepare to question everything. Our protagonist awakens from a hauntingly vivid dream: soaring towards an unfamiliar, sprawling cityscape. But the dream's tendrils have followed him into the waking world, twisting his perception of reality. The faces around him, the commuters on the street, even his own reflection, ripple with an unsettling, amphibious distortion. Every glance is a fresh wave of unease, a chilling whisper that things are fundamentally wrong. As he navigates this increasingly alien world, a chance encounter on his daily subway commute shatters his crumbling sense of normalcy. A captivating, enigmatic woman bumps into him, her eyes holding a knowing urgency. In hushed, hurried tones, she delivers a cryptic warning about the very fabric of his existence, the 'reality' he inhabits, before vanishing as quickly as she appeared. Was she a figment of his fracturing mind? Or a messenger from a truth too terrifying to comprehend? This chance meeting ignites a desperate search for answers. Could this distorted world be real? What is reality? And the most unsettling question of all: who, or what, is watching his every move?",
        redPathDescription: "The Red Path: The Human. A harrowing journey into the depths of the mind, where sanity hangs by a thread.",
        greenPathDescription: "The Green Path: The Amphibian. A profound exploration beyond perceived reality, embracing a new, expansive consciousness.",
        videoUrl: "https://www.youtube.com/embed/0roDfig5Ycs",
    },
    {
        id: "episode-2",
        title: "Episode 2: The Awakening",
        status: "upcoming",
        votingStartDate: new Date("2025-07-23"),
        votingEndDate: new Date("2025-07-30"),
        redWalletAddress: "0x811e9Bceeab4D26Af545E1039dc37a32100570d3",
        greenWalletAddress: "0x81D1851281d12733DCF175A3476FD1f1B245aE53",
        description: "The choice has been made. Now the consequences unfold as our protagonist faces the reality of their decision. The world around them begins to shift and change, revealing the true nature of their existence. Every step forward brings new revelations, new challenges, and new questions about what it means to be human, or something more.",
        redPathDescription: "The Red Path: Embrace the chaos and dive deeper into the rabbit hole of consciousness.",
        greenPathDescription: "The Green Path: Transcend the limitations of human perception and embrace the amphibian within.",
        videoUrl: "https://www.youtube.com/embed/0roDfig5Ycs"
    },
    // {
    //     id: "episode-3",
    //     title: "Episode 3: The Resistance",
    //     status: "upcoming",
    //     votingStartDate: new Date("2024-02-01"),
    //     votingEndDate: new Date("2024-02-08"),
    //     redWalletAddress: "0x811e9Bceeab4D26Af545E1039dc37a32100570d3",
    //     greenWalletAddress: "0x81D1851281d12733DCF175A3476FD1f1B245aE53",
    //     description: "The battle for reality reaches its climax as forces beyond comprehension clash in the ultimate showdown. The fate of consciousness itself hangs in the balance as our protagonist must make the final choice that will determine not just their own destiny, but the destiny of all who have been touched by this extraordinary journey.",
    //     redPathDescription: "The Red Path: Stand against the system and fight for human consciousness.",
    //     greenPathDescription: "The Green Path: Evolve beyond the conflict and find harmony in the new reality.",
    //     videoUrl: "https://www.youtube.com/embed/0roDfig5Ycs"
    // }
];

// Helper functions for episode management
export const getEpisodeStatus = (episodeId: string): EpisodeConfig | null => {
    return EPISODE_CONFIGS.find(episode => episode.id === episodeId) || null;
};

export const isVotingActive = (episode: EpisodeConfig): boolean => {
    if (episode.status !== 'active') return false;
    if (!episode.votingStartDate || !episode.votingEndDate) return false;

    const now = new Date();
    return now >= episode.votingStartDate && now <= episode.votingEndDate;
};

export const getVotingCountdown = (episode: EpisodeConfig): string | null => {
    if (episode.status !== 'upcoming' || !episode.votingStartDate) return null;

    const now = new Date();
    const timeDiff = episode.votingStartDate.getTime() - now.getTime();

    if (timeDiff <= 0) return null;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h`;
};

// Function to automatically update episode status based on dates
export const updateEpisodeStatuses = (): EpisodeConfig[] => {
    const now = new Date();

    return EPISODE_CONFIGS.map(episode => {
        if (episode.status === 'upcoming' && episode.votingStartDate && now >= episode.votingStartDate) {
            return { ...episode, status: 'active' as const };
        }
        if (episode.status === 'active' && episode.votingEndDate && now > episode.votingEndDate) {
            // This would need to be updated with actual vote counts when voting ends
            return { ...episode, status: 'completed' as const };
        }
        return episode;
    });
};

// Function to add a new episode (for future automation)
export const addNewEpisode = (newEpisode: Omit<EpisodeConfig, 'id'>): EpisodeConfig[] => {
    const newId = `episode-${EPISODE_CONFIGS.length + 1}`;
    const episodeWithId: EpisodeConfig = { ...newEpisode, id: newId };
    return [...EPISODE_CONFIGS, episodeWithId];
};

export const cacheVotingResults = (episodeId: string, redVotes: number, greenVotes: number, totalVotes: number) => {
    const episode = getEpisodeStatus(episodeId);
    if (!episode) return;

    if (typeof window !== 'undefined') {
        const cacheData = {
            redVotes,
            greenVotes,
            totalVotes,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(`voting_cache_${episodeId}`, JSON.stringify(cacheData));
    }

    episode.cachedRedVotes = redVotes;
    episode.cachedGreenVotes = greenVotes;
    episode.cachedTotalVotes = totalVotes;
    episode.cacheTimestamp = new Date();
};

export const getCachedVotingResults = (episodeId: string) => {
    if (typeof window === 'undefined') {
        return null;
    }

    const cacheKey = `voting_cache_${episodeId}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        try {
            const data = JSON.parse(cached);
            return {
                redVotes: data.redVotes,
                greenVotes: data.greenVotes,
                totalVotes: data.totalVotes,
                timestamp: new Date(data.timestamp)
            };
        } catch (error) {
            console.error('Failed to parse cached voting results:', error);
        }
    }

    return null;
};

export const finalizeVotingResults = (episodeId: string, redVotes: number, greenVotes: number) => {
    const episode = getEpisodeStatus(episodeId);
    if (!episode) return;

    const totalVotes = redVotes + greenVotes;
    const winner = redVotes > greenVotes ? 'red' : 'green';

    cacheVotingResults(episodeId, redVotes, greenVotes, totalVotes);

    episode.status = 'completed';
    episode.winner = winner;
    episode.redVotes = redVotes;
    episode.greenVotes = greenVotes;
    episode.totalVotes = totalVotes;

    console.log(`Voting finalized for ${episodeId}: ${winner} wins with ${totalVotes} total votes`);
}; 