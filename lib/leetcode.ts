const LC_URL = 'https://leetcode.com/graphql'

async function lcQuery(query: string, variables: Record<string, unknown>) {
  const res = await fetch(LC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`)
  const data = await res.json()
  if (data.errors) throw new Error(data.errors[0].message)
  return data.data
}

export async function getRecentAccepted(username: string, limit = 20) {
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id title titleSlug timestamp lang
      }
    }
  `
  const data = await lcQuery(query, { username, limit })
  return data.recentAcSubmissionList as {
    id: string
    title: string
    titleSlug: string
    timestamp: string
    lang: string
  }[]
}

export async function getProblemDetail(titleSlug: string) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId title titleSlug difficulty
        topicTags { name }
      }
    }
  `
  const data = await lcQuery(query, { titleSlug })
  return data.question as {
    questionId: string
    title: string
    titleSlug: string
    difficulty: string
    topicTags: { name: string }[]
  }
}

export async function verifyUsername(username: string): Promise<boolean> {
  try {
    const subs = await getRecentAccepted(username, 1)
    return Array.isArray(subs)
  } catch {
    return false
  }
}
