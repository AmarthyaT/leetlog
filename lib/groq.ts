interface CardInput {
  problem_title: string
  problem_id: number
  difficulty: string
  lc_topic_tags: string[]
  language: string
  submitted_code?: string | null
}

interface GeneratedCard {
  pattern_tags: string[]
  core_intuition: string
  approach_summary: string
  optimal_approach: string
  time_complexity: string
  space_complexity: string
  gotchas: string[]
  struggle_assessment: string
}

const ALLOWED_PATTERNS = [
  'Two Pointers','Sliding Window','Binary Search','Hash Map','Stack','Queue',
  'Monotonic Stack','Heap','Trie','Graph BFS','Graph DFS','Topological Sort',
  'Union Find','Dynamic Programming','Backtracking','Greedy','Divide and Conquer',
  'Bit Manipulation','Math','Linked List','Tree BFS','Tree DFS','Prefix Sum',
  'Matrix','Segment Tree'
]

export async function generateEssenceCard(input: CardInput, apiKey: string): Promise<GeneratedCard> {
  const codeSection = input.submitted_code
    ? `Student's code (${input.language}):\n\`\`\`${input.language}\n${input.submitted_code.slice(0, 2000)}\n\`\`\``
    : `Language used: ${input.language}\n(Code not available — generate based on problem metadata)`

  const prompt = `You are a DSA expert creating a revision card for a student.

Problem: ${input.problem_title} (LeetCode #${input.problem_id}, ${input.difficulty})
LeetCode tags: ${input.lc_topic_tags.join(', ')}
${codeSection}

Return ONLY valid JSON, no markdown, no explanation:
{
  "pattern_tags": [],
  "core_intuition": "",
  "approach_summary": "",
  "optimal_approach": "",
  "time_complexity": "",
  "space_complexity": "",
  "gotchas": [],
  "struggle_assessment": ""
}

Rules:
- pattern_tags: max 3, only from: ${ALLOWED_PATTERNS.join(', ')}
- core_intuition: 1-2 sentences, the key insight to crack this problem
- approach_summary: what the code does in plain English (or standard approach if no code)
- optimal_approach: best known approach and why
- time_complexity: e.g. "O(n) — single pass"
- space_complexity: e.g. "O(1) — constant extra space"
- gotchas: 2-3 specific edge cases or bugs to watch for
- struggle_assessment: 1 line on what's tricky + what to focus on in revision`

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq error: ${res.status} — ${err}`)
  }

  const data = await res.json()
  const text = data.choices[0].message.content.trim()

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean) as GeneratedCard
  } catch {
    throw new Error('Failed to parse Groq response as JSON')
  }
}
