# Connectify

💡 Project: FriendSwipe – A Friendship Tinder with Smart Recommendations
🎯 Core Idea
A web app where:
Users create a profile
Get friend suggestions
Swipe:
👉 Right = Connect
👈 Left = Skip
If matched → share social links (like Instagram)
🧱 Core Features (Keep it Simple + Cool)
👤 1. User Profile
Each user has:
Name
Bio
Interests
Instagram ID (or other link)
🔥 2. Swipe System (MAIN UI)
Like Tinder:
[ User Card ]
Name: Sarah
Interests: Music, Coding
[ 👈 Skip ]   [ 👉 Connect ]
👉 This is your main highlight feature
🧠 3. Smart Recommendation Modes (YOUR TWIST)
🎛️ Toggle:
Mode:
( ) Similar People
( ) Different People 🌍
✅ Similar Mode
Based on:
Same interests
Mutual friends
🌍 Different Mode (Anti-Echo Feature)
Suggest:
Different interests
Far users in graph
Helps break echo chambers
💡 This is what makes your project UNIQUE
💬 4. Match & Connect
When both users swipe right:
🎉 It's a Match!
Connect here:
Instagram: @username
👉 No need to build full chat → keep it simple
⚠️ 5. Echo Chamber Warning (Small but impressive)
If user only swipes similar people:
⚠️ You're only connecting with similar profiles.
Try "Different Mode" to explore more!
📊 6. Simple Score (Optional but nice)
Diversity Score: 40% (Low)
🧠 Graph Logic (Explain in Viva)
Users = Nodes
Connections = Edges
Similar Mode:
Recommend based on:
Mutual friends
Common interests
Different Mode:
Recommend:
Nodes far away in graph
Different clusters
💻 Tech Stack (Simple)
Frontend:
HTML
CSS (make cards look nice)
JavaScript (for swipe logic)
Backend (basic):
Node.js
JSON file for storage
🧩 UI Idea (Very Important for marks)
Swipe Card Design:
Center card
Buttons:
❌ Skip
❤️ Connect
👉 You can also add:
Drag/swipe animation (bonus 🔥)
🚀 Small Extra Features (Pick 2–3)
🎯 Interest tags (clickable)
🔄 Refresh recommendations
🌙 Dark mode
📍 Location-based suggestion (basic)
📊 Match history
🧾 Portfolio Description (USE THIS)
“Developed a Tinder-inspired friendship platform that uses graph-based algorithms to recommend both similar and diverse connections, incorporating an anti-echo chamber mechanism to promote network diversity.”
⚠️ Keep It Realistic
❌ No need for real-time chat
❌ No need for database
✅ Focus on:
Swipe UI
Recommendation logic
Clean working demo

website name: connectify

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/86bdeb03-eaed-47b6-8518-358c59796fa9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
