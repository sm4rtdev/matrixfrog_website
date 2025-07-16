# MatrixFrog Voting System

This directory contains the enhanced voting system for the MatrixFrog Construct platform.

## Features

### 🏆 Winner/Loser Highlighting
- **Completed episodes** show the winner with bright colors and a trophy icon
- **Losers** are grayed out and non-clickable
- **Active episodes** have working voting functionality
- **Upcoming episodes** show countdown timers

### 📊 Episode Management
- **Episode 1 (Completed)**: Green Path won with 67 votes vs 45 red votes
- **Episode 2 (Active)**: Currently accepting votes
- **Episode 3 (Upcoming)**: Shows countdown to voting start

### 🔄 Automation Ready
The system is designed for easy automation:
- Update `episodeConfig.ts` to add new episodes
- Set voting start/end dates
- System automatically handles status changes

## How to Add a New Episode

1. **Edit `episodeConfig.ts`**
```typescript
{
  id: "episode-4",
  title: "Episode 4: New Chapter",
  status: "upcoming",
  votingStartDate: new Date("2024-03-01"),
  votingEndDate: new Date("2024-03-08"),
  redWalletAddress: "0x...",
  greenWalletAddress: "0x...",
  description: "Episode description...",
  redPathDescription: "Red path description...",
  greenPathDescription: "Green path description...",
  videoUrl: "https://youtube.com/embed/..."
}
```

2. **Update Episode Status**
- Set `status: "active"` when voting should begin
- Set `status: "completed"` with `winner: "red"` or `winner: "green"` when voting ends
- Add final vote counts: `redVotes`, `greenVotes`, `totalVotes`

## File Structure

- `page.tsx` - Main dashboard with episode selection
- `VotingSection.tsx` - Voting component with different states
- `episodeConfig.ts` - Episode configuration and management
- `README.md` - This documentation

## Future Automation Ideas

1. **7-Day Countdown System**
   - Automatically activate episodes based on dates
   - Send notifications when voting starts/ends
   - Auto-calculate winners based on wallet balances

2. **Database Integration**
   - Store episode data in a database
   - Track voting history and analytics
   - Real-time vote counting

3. **Admin Panel**
   - Web interface to manage episodes
   - Upload videos and descriptions
   - Set voting periods

## Current Status

✅ **Episode 1**: Completed (Green Path Winner)  
🔄 **Episode 2**: Active (Voting Enabled)  
⏳ **Episode 3**: Upcoming (Countdown Active)

The system is ready for the next video release and voting cycle! 