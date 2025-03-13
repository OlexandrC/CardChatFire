export async function fetchChatData(): Promise<any> {
    const apiUrl = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch');

        return await response.json();
    } catch (error) {
        console.warn(`Can't load JSON, using local data.`);

        return {
            dialogue: [
                { name: "Sheldon", text: "I admit {satisfied} the design of Cookie Crush is quite elegant in its simplicity." },
                { name: "Leonard", text: "That’s practically a compliment, Sheldon. {intrigued} Are you feeling okay?" },
                { name: "Penny", text: "Don’t worry, Leonard. He’s probably just trying to justify playing it himself." },
                { name: "Sheldon", text: "Incorrect. {neutral} I’m studying its mechanics. The progression system is oddly satisfying." },
                { name: "Penny", text: "It’s called fun, Sheldon. You should try it more often." },
                { name: "Leonard", text: "She’s got a point. Sometimes, a simple game can be relaxing." },
                { name: "Neighbour", text: "I fully agree {affirmative}" },
                { name: "Sheldon", text: "Relaxing? I suppose there’s merit in low-stakes gameplay to reduce cortisol levels." },
                { name: "Penny", text: "Translation: Sheldon likes crushing cookies but won’t admit it. {laughing}" },
                { name: "Sheldon", text: "Fine. I find the color-matching oddly soothing. Happy?" },
                { name: "Leonard", text: "Very. Now we can finally play as a team in Wordscapes." },
                { name: "Penny", text: "Wait, Sheldon’s doing team games now? What’s next, co-op decorating?" },
                { name: "Sheldon", text: "Unlikely. But if the design involves symmetry and efficiency, I may consider it." },
                { name: "Penny", text: "See? Casual gaming brings people together!" },
                { name: "Leonard", text: "Even Sheldon. That’s a win for everyone. {win}" },
                { name: "Sheldon", text: "Agreed. {neutral} Though I still maintain chess simulators are superior." },
                { name: "Penny", text: "Sure, Sheldon. {intrigued} You can play chess *after* we beat this next level." }
            ],
            emojies: [
                { name: "sad", url: "https://api.dicebear.com:81/9.x/fun-emoji/png?seed=Sad" },
                { name: "intrigued", url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Sawyer" },
                { name: "neutral", url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Destiny" },
                { name: "satisfied", url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Jocelyn" },
                { name: "laughing", url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Sophia" }
            ],
            avatars: [
                { name: "Sheldon", url: "https://api.dicebear.com/9.x/personas/png?body=squared&clothingColor=6dbb58&eyes=open&hair=buzzcut&hairColor=6c4545&mouth=smirk&nose=smallRound&skinColor=e5a07e", position: "left" },
                { name: "Penny", url: "https://api.dicebear.com/9.x/personas/png?body=squared&clothingColor=f55d81&eyes=happy&hair=extraLong&hairColor=f29c65&mouth=smile&nose=smallRound&skinColor=e5a07e", position: "right" },
                { name: "Leonard", url: "https://api.dicebear.com/9.x/personas/png?body=checkered&clothingColor=f3b63a&eyes=glasses&hair=shortCombover&hairColor=362c47&mouth=surprise&nose=mediumRound&skinColor=d78774", position: "right" }
            ]
        };
    }
}
