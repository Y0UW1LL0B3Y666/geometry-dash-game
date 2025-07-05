# 🎵 Adding Custom Sounds to Geometry Dash

This guide will help you add your own custom sounds to the game, including multiple sound variations!

## 📁 File Structure

Your game folder should look like this:
```
geometry dash/
├── index.html
├── game.js
├── README.md
├── SOUNDS_GUIDE.md
└── sounds/
    ├── jump.mp3 (or jump1.mp3, jump2.mp3, etc.)
    ├── death.mp3 (or death1.mp3, death2.mp3, etc.)
    ├── score.mp3 (or score1.mp3, score2.mp3, etc.)
    ├── background.mp3 (or background1.mp3, background2.mp3, etc.)
    ├── powerup.mp3
    ├── levelup.mp3
    ├── menu_select.mp3
    └── menu_confirm.mp3
```

## 🎵 Sound Options

### Option 1: Single Sounds (Simple)
Use one sound file for each event:
- `jump.mp3`
- `death.mp3`
- `score.mp3`
- `background.mp3`

### Option 2: Multiple Sounds (Advanced)
Use multiple sound files for variety:
- `jump1.mp3`, `jump2.mp3`, `jump3.mp3`
- `death1.mp3`, `death2.mp3`, `death3.mp3`
- `score1.mp3`, `score2.mp3`, `score3.mp3`
- `background1.mp3`, `background2.mp3`, `background3.mp3`

## 🎯 How to Add Multiple Sounds

### Step 1: Prepare Your Sound Files
1. **Create variations** of each sound type
2. **Name them consistently**: `jump1.mp3`, `jump2.mp3`, etc.
3. **Keep them similar in length** and style
4. **Convert to MP3** format

### Step 2: Place Files in Sounds Folder
Put all your sound files in the `sounds/` folder.

### Step 3: The Game Automatically Detects Multiple Sounds
The game will automatically:
- **Randomly select** from your multiple sounds
- **Fall back** to single sounds if no variations exist
- **Mix and match** different variations for variety

## 🎵 Sound Categories

### Core Game Sounds (Required)
| Event | Single File | Multiple Files | Description |
|-------|-------------|----------------|-------------|
| **Jump** | `jump.mp3` | `jump1.mp3`, `jump2.mp3`, etc. | Plays when cube jumps |
| **Death** | `death.mp3` | `death1.mp3`, `death2.mp3`, etc. | Plays when you crash |
| **Score** | `score.mp3` | `score1.mp3`, `score2.mp3`, etc. | Plays when passing obstacles |
| **Background** | `background.mp3` | `background1.mp3`, `background2.mp3`, etc. | Looping background music |

### Additional Sounds (Optional)
| Event | File Name | Description |
|-------|-----------|-------------|
| **Power-up** | `powerup.mp3` | For future power-up features |
| **Level Up** | `levelup.mp3` | For future leveling system |
| **Menu Select** | `menu_select.mp3` | For menu navigation |
| **Menu Confirm** | `menu_confirm.mp3` | For menu confirmation |

## 🎨 Multiple Sound Examples

### Jump Sound Variations
```
jump1.mp3 - High-pitched "boop"
jump2.mp3 - Low-pitched "pop"
jump3.mp3 - Electronic "beep"
jump4.mp3 - Retro "jump" sound
```

### Death Sound Variations
```
death1.mp3 - Dramatic crash
death2.mp3 - Explosion sound
death3.mp3 - Game over chime
death4.mp3 - Failure sound
```

### Score Sound Variations
```
score1.mp3 - Quick "ding"
score2.mp3 - Success chime
score3.mp3 - Point sound
score4.mp3 - Achievement sound
```

### Background Music Variations
```
background1.mp3 - Upbeat electronic
background2.mp3 - Chiptune style
background3.mp3 - Energetic rock
background4.mp3 - Ambient electronic
```

## 🔧 Advanced Sound Control

### Manual Sound Selection
You can play specific sounds from a group:

```javascript
// Play the 2nd jump sound specifically
playSoundFromGroup('jump', 2, 0.3);

// Play the 1st death sound specifically
playSoundFromGroup('death', 1, 0.4);
```

### Adding New Sound Groups
To add completely new sound categories:

```javascript
// Load new sound group
loadSoundGroup('powerup', [
    './sounds/powerup1.mp3',
    './sounds/powerup2.mp3',
    './sounds/powerup3.mp3'
]);

// Play random sound from new group
playRandomSound('powerup', 0.5);
```

### Custom Sound Triggers
You can add sounds to new game events:

```javascript
// Example: Add sound when reaching certain score
if (score === 100) {
    playSound('levelup', 0.6);
}

// Example: Add sound for special events
if (distance > 1000) {
    playRandomSound('achievement', 0.4);
}
```

## 🎵 Sound File Requirements

### File Naming Convention
- **Single sounds**: `eventname.mp3`
- **Multiple sounds**: `eventname1.mp3`, `eventname2.mp3`, etc.
- **Use lowercase** and **no spaces**
- **Numbers only** for variations (1, 2, 3, not 01, 02)

### File Specifications
- **Format**: MP3, WAV, or OGG (MP3 recommended)
- **Size**: Under 1MB each for fast loading
- **Duration**:
  - Jump/Score: 0.3-1 second
  - Death: 1-2 seconds
  - Background: 1-3 minutes (will loop)
- **Quality**: 44.1 kHz, 128-192 kbps

## 🎯 Multiple Sound Strategies

### Strategy 1: Random Variety
- Create 3-5 variations of each sound
- Let the game randomly choose
- Keeps gameplay fresh and interesting

### Strategy 2: Contextual Sounds
- Different sounds for different situations
- Example: Different jump sounds based on obstacle type
- More complex but very engaging

### Strategy 3: Progressive Sounds
- Sounds change as difficulty increases
- Example: More intense music at higher speeds
- Creates dynamic atmosphere

## 🎵 Where to Find Multiple Sounds

### Sound Effect Packs
- **Freesound.org** - Search for "jump variations", "game sounds"
- **Zapsplat.com** - Professional sound effect packs
- **OpenGameArt.org** - Game-specific sound collections

### Music Variations
- **Incompetech.com** - Multiple tracks by same artist
- **Bensound.com** - Different styles of background music
- **YouTube Audio Library** - Various music categories

### Creating Variations
- **Audacity** (free) - Edit and create variations
- **Online converters** - Change pitch, speed, effects
- **Sound generators** - Create electronic variations

## 🛠️ Troubleshooting Multiple Sounds

### Some Variations Not Playing?
1. **Check file names** - Must follow exact naming pattern
2. **Check file format** - All files must be same format
3. **Check file sizes** - Very large files may not load
4. **Check browser console** - Look for loading errors

### Random Selection Not Working?
1. **Verify file names** - Must be `name1.mp3`, `name2.mp3`, etc.
2. **Check file count** - Need at least 2 files for random selection
3. **Test single files** - Make sure individual files work first

### Background Music Issues?
1. **Multiple tracks** - Each track should be complete and loopable
2. **File sizes** - Large music files may cause delays
3. **Format consistency** - All tracks should be same format

## 🎮 Quick Setup for Multiple Sounds

### Minimal Setup (2 variations each)
```
sounds/
├── jump1.mp3
├── jump2.mp3
├── death1.mp3
├── death2.mp3
├── score1.mp3
├── score2.mp3
├── background1.mp3
└── background2.mp3
```

### Full Setup (3+ variations each)
```
sounds/
├── jump1.mp3
├── jump2.mp3
├── jump3.mp3
├── death1.mp3
├── death2.mp3
├── death3.mp3
├── score1.mp3
├── score2.mp3
├── score3.mp3
├── background1.mp3
├── background2.mp3
├── background3.mp3
├── powerup.mp3
└── levelup.mp3
```

## 🎯 Pro Tips

1. **Start Simple**: Begin with 2-3 variations, add more later
2. **Keep Consistent**: All variations should feel like they belong together
3. **Test Thoroughly**: Make sure all variations work before adding more
4. **Backup Original**: Keep your original sound files safe
5. **Volume Balance**: Ensure all variations have similar volume levels

Your Geometry Dash game will now have rich, varied audio that keeps players engaged! 🎵✨ 