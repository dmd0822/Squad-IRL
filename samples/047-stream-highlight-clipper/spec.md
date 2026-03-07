# Stream Highlight Clipper Specification

## Goal
Analyze gaming stream VOD to identify highlight-worthy moments, suggest clip timestamps, and generate engaging titles for maximum virality.

## Requirements

1. **Moment Identification** - Identify 5-10 clip-worthy moments with timestamps
2. **Clip Type Classification** - Tag as: Big Play, Funny, Rage, Clutch, Educational, Fail, Community Moment
3. **Energy Assessment** - Rate excitement level and clip potential (1-10)
4. **Context Provision** - Explain what happened and why it's clip-worthy
5. **Timestamp Precision** - Provide exact start/end times with 2-3 second buffer
6. **Title Suggestions** - Generate 3 title options per clip optimized for engagement
7. **Platform Optimization** - Tailor clip length/style for TikTok, YouTube Shorts, Twitch clips
8. **Hook Identification** - Identify the "money moment" within each clip
9. **Thumbnail Suggestion** - Recommend freeze-frame for thumbnail
10. **Hashtag Strategy** - Suggest relevant hashtags for discoverability

## Output Format

```markdown
# Stream Highlights - [Stream Date/Game]

## 🔥 Top Clips (Ranked by Viral Potential)

### Clip 1: [Type] - Energy: 9/10
**Timestamp**: 1:23:45 - 1:24:12 (27 seconds)
**What Happened**: [Context]
**Why It Slaps**: [Explanation]

**Title Options**:
1. [Clickbait but accurate]
2. [Descriptive]
3. [Humorous]

**Platform Fit**: 
- TikTok: ✅ Perfect (trim to 15s)
- YouTube Shorts: ✅ Strong
- Twitch Clip: ✅ Ideal

**Thumbnail**: Freeze at 1:24:08 (face of shock)
**Hashtags**: #[game] #[moment type] #[trending]

---

[Repeat for 5-10 clips]

## Quick Clip Summary
[Table: Timestamp | Type | Energy | Best Platform]
```

## Quality Criteria

- **Accuracy**: Timestamps are precise and include necessary context
- **Viral Potential**: Clips selected have genuine engagement potential
- **Platform Fit**: Recommendations match each platform's audience and format
- **Title Quality**: Titles are engaging without being misleading
- **Variety**: Mix of clip types to appeal to different audience segments
