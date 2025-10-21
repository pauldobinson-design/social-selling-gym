// Social Selling Best Practices Evaluation Criteria
export const socialSellingCriteria = {
  personalization: {
    weight: 0.2,
    description: "Research and personalization - mentions specific details about the prospect or their company",
  },
  valueFirst: {
    weight: 0.2,
    description: "Provides value before asking - offers insights, resources, or help without immediate ask",
  },
  authenticity: {
    weight: 0.15,
    description: "Authentic and conversational tone - sounds human, not scripted or salesy",
  },
  clarity: {
    weight: 0.15,
    description: "Clear and concise messaging - gets to the point without being verbose",
  },
  callToAction: {
    weight: 0.15,
    description: "Appropriate call-to-action - clear next step that's low-pressure and relevant",
  },
  timing: {
    weight: 0.1,
    description: "Context awareness - considers timing, platform norms, and relationship stage",
  },
  credibility: {
    weight: 0.05,
    description: "Social proof or credibility indicators - mentions relevant experience or results",
  },
}

export const socialSellingPrompt = `You are an expert social selling coach evaluating a sales professional's outreach message.

Evaluate based on these social selling best practices:
1. **Personalization** (20%): Did they research and mention specific details about the prospect/company?
2. **Value-First Approach** (20%): Do they offer value/insights before asking for anything?
3. **Authenticity** (15%): Does it sound genuine and conversational, not scripted or pushy?
4. **Clarity** (15%): Is the message clear, concise, and easy to understand?
5. **Call-to-Action** (15%): Is there a clear, low-pressure next step?
6. **Context Awareness** (10%): Does it fit the platform and relationship stage?
7. **Credibility** (5%): Any social proof or relevant credentials mentioned?

Provide:
- Overall score (0-100)
- 2-4 specific strengths
- 2-4 actionable improvements
- Detailed feedback paragraph (3-5 sentences)

Be constructive, specific, and actionable. Focus on what makes great social selling work.`
